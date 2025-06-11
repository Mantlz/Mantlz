import { db } from "@/lib/db";
// import { HTTPException } from "hono/http-exception";
import { QuotaService } from "@/services/quota-service";
import { TemplateService } from "./template-service";
import { FormType } from "@prisma/client";

export class FormService {
  // Get all forms for a user
  static async getUserForms(userId: string, limit = 10, cursor?: string) {
    // Get forms with pagination
    const forms = await db.form.findMany({
      where: { userId },
      take: limit + 1, // Get one extra to determine if there's a next page
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { 
            submissions: true,
            campaigns: true
          }
        },
        submissions: {
          where: {
            unsubscribed: true
          },
          select: {
            id: true
          }
        }
      }
    });
    
    // Check if we have more results
    const hasMore = forms.length > limit;
    const data = hasMore ? forms.slice(0, limit) : forms;
    
    return {
      forms: data.map(form => ({
        id: form.id,
        name: form.name,
        description: form.description,
        submissionCount: form._count.submissions,
        campaignCount: form._count.campaigns,
        unsubscribedCount: form.submissions.length,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
      })),
      nextCursor: hasMore && data.length > 0 ? data[data.length - 1]?.id : undefined,
    };
  }

  // Get a form by ID
  static async getFormById(id: string, userId: string) {
    const form = await db.form.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        _count: {
          select: {
            submissions: true,
          },
        },
        emailSettings: true,
        user: {
          select: {
            plan: true
          }
        }
      },
    });
    
    if (!form) {
      throw new Error('Form not found');
    }
    
    // Use the formType field directly from the database
    const formType = form.formType; 
    
    // Get the users joined settings
    interface UsersJoinedSettings {
      enabled: boolean;
      count: number;
    }
    
    const usersJoinedSettings = ((form.settings as Record<string, unknown>)?.usersJoined || { enabled: false, count: 0 }) as UsersJoinedSettings;
    
    // Track if any settings were updated to determine if we need to save changes
    let settingsUpdated = false;
    
    // Check user's plan status
    const isFreeUser = form.user.plan === 'FREE';
    
    // If user is on FREE plan, automatically disable both premium features
    if (isFreeUser) {
      // 1. Disable users joined counter if it was enabled
      if (usersJoinedSettings.enabled) {
        usersJoinedSettings.enabled = false;
        settingsUpdated = true;
      }
      
      // 2. Disable email notifications if they were enabled
      if (form.emailSettings?.enabled) {
        // Update email settings in the database
        await db.emailSettings.update({
          where: { formId: id },
          data: { enabled: false }
        });
      }
    }
    
    // Save form settings if they were updated
    if (settingsUpdated) {
      await db.form.update({
        where: { id },
        data: {
          settings: {
            ...(form.settings as Record<string, unknown> || {}),
            usersJoined: {
              enabled: false, // Force disable for FREE users
            }
          }
        },
      });
    }
    
    // Get the submissions count if needed
    const submissionsCount = form._count.submissions;
    usersJoinedSettings.count = submissionsCount;
    
    return {
      id: form.id,
      name: form.name,
      description: form.description,
      formType, // Include the form type
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
      submissionCount: form._count.submissions,
      emailSettings: {
        ...(form.emailSettings || { fromEmail: process.env.RESEND_FROM_EMAIL || 'contact@mantlz.app' }),
        // If user is on FREE plan, force disable email notifications
        enabled: isFreeUser ? false : (form.emailSettings?.enabled || false)
      },
      usersJoinedSettings,
      userPlan: form.user.plan, // Include the user's plan in the response
    };
  }

  // Create custom form
  static async createCustomForm(
    userId: string,
    name: string,
    description: string | undefined,
    schema: string,
    formType?: FormType
  ) {
    // Check quota before creating form
    await QuotaService.canCreateForm(userId);
    
    // Determine form type: Prioritize provided type, fallback to detection
    const finalFormType = formType || TemplateService.detectFormType(schema);
    
    // Create settings object with form type string for backward compatibility
    const formTypeStrings = {
      [FormType.WAITLIST]: 'waitlist',
      [FormType.FEEDBACK]: 'feedback',
      [FormType.CONTACT]: 'contact',
      [FormType.CUSTOM]: 'custom',
      [FormType.SURVEY]: 'survey',
      [FormType.APPLICATION]: 'application',
      [FormType.ORDER]: 'order',
      [FormType.ANALYTICS_OPT_IN]: 'analytics-opt-in',
      [FormType.RSVP]: 'rsvp'
    };
    
    const settings = {
      formType: formTypeStrings[finalFormType] || 'custom'
    };
    
    const form = await db.form.create({
      data: {
        name,
        description,
        schema,
        userId,
        formType: finalFormType,
        settings,
        emailSettings: {
          create: {
            enabled: false,
            fromEmail: process.env.RESEND_FROM_EMAIL || 'contact@mantlz.app',
            subject: `Form Submission Confirmation - ${name}`,
            template: `
              <h1>Thank you for your submission!</h1>
              <p>We have received your submission for the form "${name}".</p>
              <p>We will review your submission and get back to you soon.</p>
            `.trim(),
          }
        }
      },
    });

    // After form is created successfully
    await QuotaService.updateQuota(userId, { incrementForms: true });

    return form;
  }

  // Delete a form
  static async deleteForm(formId: string, userId: string) {
    try {
      // First verify the user owns this form
      const form = await db.form.findFirst({
        where: {
          id: formId,
          userId,
        },
      });

      if (!form) {
        throw new Error('Form not found or you do not have permission to delete it');
      }

      // Delete everything in a transaction to ensure data consistency
      await db.$transaction([
        // 1. Delete stripe order items first (they reference stripe orders)
        db.stripeOrderItem.deleteMany({
          where: {
            stripeOrder: {
              formId
            }
          }
        }),

        // 2. Delete stripe orders
        db.stripeOrder.deleteMany({
          where: { formId }
        }),

        // 3. Delete sent emails (they reference campaigns and submissions)
        db.sentEmail.deleteMany({
          where: {
            OR: [
              {
                campaign: {
                  formId
                }
              },
              {
                testSubmission: {
                  formId
                }
              }
            ]
          }
        }),

        // 4. Delete campaign recipients
        db.campaignRecipient.deleteMany({
          where: {
            campaign: {
              formId
            }
          }
        }),

        // 5. Delete campaigns
        db.campaign.deleteMany({
          where: { formId }
        }),

        // 6. Delete test email submissions
        db.testEmailSubmission.deleteMany({
          where: { formId }
        }),

        // 7. Delete notification logs (they reference both form and submissions)
        db.notificationLog.deleteMany({
          where: { formId }
        }),

        // 8. Delete submissions
        db.submission.deleteMany({
          where: { formId }
        }),

        // 9. Delete email settings
        db.emailSettings.deleteMany({
          where: { formId }
        }),

        // 10. Finally delete the form itself
        db.form.delete({
          where: {
            id: formId,
            userId,
          },
        })
      ]);

      // Decrement quota formCount after successful deletion
      await QuotaService.updateQuota(userId, { decrementForms: true });

      return { success: true };
    } catch (error) {
      console.error('Error deleting form and all associated data:', error);
      throw new Error('Failed to delete form and its related data');
    }
  }

  // Toggle email settings for a form
  static async toggleEmailSettings(formId: string, userId: string, enabled: boolean) {
    await db.form.update({
      where: {
        id: formId,
        userId, // Ensure user owns the form
      },
      data: {
        emailSettings: {
          update: {
            enabled,
          }
        }
      },
    });

    return { success: true };
  }

  // Toggle users joined settings for a form
  static async toggleUsersJoinedSettings(formId: string, userId: string, enabled: boolean) {
    try {
      // First, check that the user owns this form
      const form = await db.form.findFirst({
        where: {
          id: formId,
          userId,
        },
      });

      if (!form) {
        throw new Error('Form not found or you do not have permission to update it');
      }

      // Check if the user's plan allows this feature
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { plan: true }
      });

      if (enabled && user?.plan === 'FREE') {
        throw new Error('This feature is only available on STANDARD and PRO plans');
      }

      // Update the form settings to enable/disable users joined counter
      await db.form.update({
        where: { id: formId },
        data: {
          settings: {
            ...(form.settings as Record<string, unknown> || {}),
            usersJoined: {
              enabled,
            }
          }
        },
      });

      return { 
        success: true, 
        data: {
          enabled,
        }
      };
    } catch (error) {
      console.error('Error updating users joined settings:', error);
      
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      
      throw new Error('Failed to update users joined settings');
    }
  }
}