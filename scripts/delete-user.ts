import { PrismaClient } from '../node_modules/@prisma/client';

const prisma = new PrismaClient();

/**
 * Deletes a user and all their related data from the database
 * @param userId - The ID of the user to delete
 */
async function deleteUser(userId: string) {
  console.log(`Starting deletion process for user: ${userId}`);

  try {
    // Start a transaction to ensure all deletions happen atomically
    await prisma.$transaction(async (tx) => {
      // First, delete all data that depends on forms (since forms depend on user)
      const userForms = await tx.form.findMany({
        where: { userId },
        select: { id: true }
      });
      
      const formIds = userForms.map(form => form.id);
      
      if (formIds.length > 0) {
        console.log(`Found ${formIds.length} forms to clean up`);
        
        // Delete SentEmails (depends on campaigns and submissions)
        await tx.sentEmail.deleteMany({
          where: {
            OR: [
              { campaign: { formId: { in: formIds } } },
              { submission: { formId: { in: formIds } } },
              { testSubmission: { formId: { in: formIds } } }
            ]
          }
        });
        console.log('Deleted sent emails');
        
        // Delete CampaignRecipients (depends on campaigns and submissions)
        await tx.campaignRecipient.deleteMany({
          where: {
            OR: [
              { campaign: { formId: { in: formIds } } },
              { submission: { formId: { in: formIds } } }
            ]
          }
        });
        console.log('Deleted campaign recipients');
        
        // Delete StripeOrderItems (depends on StripeOrders)
        await tx.stripeOrderItem.deleteMany({
          where: {
            stripeOrder: { formId: { in: formIds } }
          }
        });
        console.log('Deleted stripe order items');
        
        // Delete StripeOrders (depends on forms and submissions)
        await tx.stripeOrder.deleteMany({
          where: { formId: { in: formIds } }
        });
        console.log('Deleted stripe orders');
        
        // Delete NotificationLogs (depends on forms and submissions)
        await tx.notificationLog.deleteMany({
          where: { formId: { in: formIds } }
        });
        console.log('Deleted notification logs');
        
        // Delete TestEmailSubmissions (depends on forms)
        await tx.testEmailSubmission.deleteMany({
          where: { formId: { in: formIds } }
        });
        console.log('Deleted test email submissions');
        
        // Delete Submissions (depends on forms)
        await tx.submission.deleteMany({
          where: { formId: { in: formIds } }
        });
        console.log('Deleted submissions');
        
        // Delete Campaigns (depends on forms and user)
        await tx.campaign.deleteMany({
          where: { formId: { in: formIds } }
        });
        console.log('Deleted campaigns');
        
        // Delete EmailSettings (depends on forms)
        await tx.emailSettings.deleteMany({
          where: { formId: { in: formIds } }
        });
        console.log('Deleted email settings');
        
        // Delete Forms
        await tx.form.deleteMany({
          where: { userId }
        });
        console.log('Deleted forms');
      }
      
      // Delete StripeProducts (depends on StripeConnection)
      const stripeConnection = await tx.stripeConnection.findUnique({
        where: { userId },
        select: { id: true }
      });
      
      if (stripeConnection) {
        await tx.stripeProduct.deleteMany({
          where: { stripeConnectionId: stripeConnection.id }
        });
        console.log('Deleted stripe products');
      }
      
      // Delete PaymentFailures (depends on subscription)
      const subscription = await tx.subscription.findUnique({
        where: { userId },
        select: { subscriptionId: true }
      });
      
      if (subscription) {
        await tx.paymentFailure.deleteMany({
          where: { subscriptionId: subscription.subscriptionId }
        });
        console.log('Deleted payment failures');
      }
      
      // Delete all direct user-related data
      await tx.stripeConnection.deleteMany({ where: { userId } });
      await tx.slackConfig.deleteMany({ where: { userId } });
      await tx.discordConfig.deleteMany({ where: { userId } });
      await tx.globalSettings.deleteMany({ where: { userId } });
      await tx.dnsRecord.deleteMany({ where: { userId } });
      await tx.quota.deleteMany({ where: { userId } });
      await tx.invoice.deleteMany({ where: { userId } });
      await tx.payment.deleteMany({ where: { userId } });
      await tx.subscription.deleteMany({ where: { userId } });
      await tx.apiKey.deleteMany({ where: { userId } });
      
      console.log('Deleted all user-related data');
      
      // Finally, delete the user
      const deletedUser = await tx.user.delete({
        where: { id: userId }
      });
      
      console.log(`Successfully deleted user: ${deletedUser.email} (${deletedUser.id})`);
    });
    
    console.log('User deletion completed successfully!');
    
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Main execution
async function main() {
  const userId = process.argv[2];
  
  if (!userId) {
    console.error('Please provide a user ID as an argument');
    console.log('Usage: npx tsx scripts/delete-user.ts <userId>');
    console.log('Example: npx tsx scripts/delete-user.ts cmdxr4a7t0009o7l42j1nfm0c');
    process.exit(1);
  }
  
  // Verify user exists before deletion
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, firstName: true, lastName: true }
  });
  
  if (!user) {
    console.error(`User with ID ${userId} not found`);
    process.exit(1);
  }
  
  console.log(`Found user: ${user.email} (${user.firstName} ${user.lastName})`);
  console.log('WARNING: This will permanently delete the user and ALL their data!');
  
  // In a production environment, you might want to add a confirmation prompt here
  // For now, we'll proceed with the deletion
  
  await deleteUser(userId);
}

// Run the script
if (require.main === module) {
  main().catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

export { deleteUser };