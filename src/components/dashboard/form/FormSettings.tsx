import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ExportSubmissions } from './ExportSubmissions';
import { DeleteForm } from './DeleteForm';
import { toast } from 'sonner';
import { client } from '@/lib/client';
import { cn } from "@/lib/utils"
import { UpgradeModal } from "@/components/modals/UpgradeModal";
import { Mail, Users, Download } from "lucide-react";

interface FormSettingsProps {
  formId: string;
  name: string;
  description?: string;
  formType?: string;
  emailSettings?: {
    enabled: boolean;
    fromEmail?: string;
    subject?: string;
    template?: string;
    replyTo?: string;
  } | null;
  usersJoinedSettings?: {
    enabled: boolean;
    count?: number;
  } | null;
  exportSettings?: {
    enabled: boolean;
  } | null;
  onUpdate?: (data: { name: string; description: string }) => void;
  onDelete?: (id: string) => Promise<void>;
  onRefresh?: () => void;
}

export function FormSettings({ 
  formId, 
  name, 
  formType = '', 
  emailSettings, 
  usersJoinedSettings,
  // exportSettings,
  onRefresh 
}: FormSettingsProps) {
  // Log received props for debugging
  // console.log('FormSettings props:', { formId, formType, usersJoinedSettings });
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [usersJoinedEnabled, setUsersJoinedEnabled] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isEmailSettingsLoading, setIsEmailSettingsLoading] = useState(false);
  const [isUsersJoinedSettingsLoading, setIsUsersJoinedSettingsLoading] = useState(false);
  const [upgradeFeatureName, setUpgradeFeatureName] = useState<string>('');
  const [upgradeFeatureIcon, setUpgradeFeatureIcon] = useState<React.ReactNode>(null);
  const [upgradeFeatureDescription, setUpgradeFeatureDescription] = useState<string>('');
  // const router = useRouter();

  // Sync emailEnabled state with emailSettings prop
  useEffect(() => {
    if (emailSettings) {
      setEmailEnabled(emailSettings.enabled);
    }
    if (usersJoinedSettings) {
      setUsersJoinedEnabled(usersJoinedSettings.enabled);
    }
  }, [emailSettings, usersJoinedSettings]);

  // Fetch latest form data including email settings
  const fetchFormData = useCallback(async () => {
    try {
      setIsEmailSettingsLoading(true);
      setIsUsersJoinedSettingsLoading(true);
      const response = await client.forms.getFormById.$get({
        id: formId
      });
      
      const data = await response.json();
      
      if (data && data.emailSettings) {
        setEmailEnabled(data.emailSettings.enabled);
      }
      if (data && data.usersJoinedSettings) {
        // If we're on FREE plan, the API will have already disabled the setting
        // but we need to update our UI state
        if (data.userPlan === 'FREE') {
          setUsersJoinedEnabled(false);
        } else {
          setUsersJoinedEnabled(data.usersJoinedSettings.enabled);
        }
      }
      // Set user plan from API response
      if (data && data.userPlan) {
        setUserPlan(data.userPlan);
      }
    } catch (error) {
      console.error("Failed to fetch form data:", error);
    } finally {
      setIsEmailSettingsLoading(false);
      setIsUsersJoinedSettingsLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    fetchFormData();
  }, [fetchFormData]);

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const response = await client.usage.getUsage.$get();
        const data = await response.json();
        setUserPlan(data.plan);
        
        // If plan is downgraded to FREE, disable users joined counter
        if (data.plan === 'FREE' && usersJoinedEnabled) {
          setUsersJoinedEnabled(false);
        }
      } catch (error) {
        console.error("Failed to fetch user plan:", error);
      }
    };
    
    fetchUserPlan();
  }, [usersJoinedEnabled]);

  const handleEmailToggle = async (checked: boolean) => {
    // If user is on free plan and trying to enable email notifications, show upgrade modal
    if (userPlan === 'FREE' && checked) {
      setUpgradeFeatureName("Email Notifications");
      setUpgradeFeatureIcon(<Mail className="h-5 w-5 m-2 text-slate-700 dark:text-slate-300" />);
      setUpgradeFeatureDescription("Get email notifications whenever someone submits your form. Available on Standard and Pro plans.");
      setIsUpgradeModalOpen(true);
      return;
    }

    // Optimistically update UI
    setEmailEnabled(checked);
    setIsEmailSettingsLoading(true);

    try {
      await client.forms.toggleEmailSettings.$post({
        formId: formId,
        enabled: checked
      });
      
      toast.success('Email notifications ' + (checked ? 'enabled' : 'disabled'));
      
      // Refresh parent component if needed
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      // Revert UI state on error
      setEmailEnabled(!checked);
      console.error('Failed to update email settings:', error);
      toast.error('Failed to update email settings');
    } finally {
      setIsEmailSettingsLoading(false);
    }
  };

  const handleUsersJoinedToggle = async (checked: boolean) => {
    console.log(`Toggling users joined counter: ${checked}`, {
      formId: formId,
      formType: formType
    });
    
    if (!formId) {
      console.error('No formId provided for toggle action');
      toast.error('Configuration error');
      return;
    }

    // If user is on free plan and trying to enable users joined counter, show upgrade modal
    if (userPlan === 'FREE' && checked) {
      setUpgradeFeatureName("Users Joined Counter");
      setUpgradeFeatureIcon(<Users className="h-5 w-5 m-2 text-slate-700 dark:text-slate-300" />);
      setUpgradeFeatureDescription("Show how many people have joined your waitlist to create social proof and increase conversions. Available on Standard and Pro plans.");
      setIsUpgradeModalOpen(true);
      return;
    }

    // Optimistically update UI
    setUsersJoinedEnabled(checked);
    setIsUsersJoinedSettingsLoading(true);

    try {
      // Use client.forms instead of direct fetch
      await client.forms.toggleUsersJoinedSettings.$post({
        formId: formId,
        enabled: checked
      });
      
      toast.success('Users joined counter ' + (checked ? 'enabled' : 'disabled'));
      
      // Refresh parent component if needed
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      // Revert UI state on error
      setUsersJoinedEnabled(!checked);
      console.error('Failed to update users joined settings:', error);
      toast.error('Failed to update users joined settings');
    } finally {
      setIsUsersJoinedSettingsLoading(false);
    }
  };



  return (
    <div className="space-y-6">
      {/* Debug info */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          Debug: formType="{formType}" (Users Joined Toggle {formType?.toUpperCase() === 'WAITLIST' || formType === 'waitlist' ? 'SHOULD SHOW' : 'HIDDEN'})
        </div>
      )}
       */}
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Form Name
            </label>
            <div className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white text-sm">
              {name}
            </div>
          </div>
          

          <div className="mt-6 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-600 dark:text-zinc-500" />
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</h4>
                </div>
                <div className="flex items-center">
                  {userPlan === 'FREE' && !emailEnabled && (
                    <div className="mr-3 px-2 py-0.5 text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-800/50">
                      Premium Feature
                    </div>
                  )}
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-lg",
                    emailEnabled 
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" 
                      : "bg-zinc-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-500"
                  )}>
                    {emailEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white dark:bg-zinc-900">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Get notified via email when someone submits your form.
                  </p>
                  {userPlan === 'FREE' && !emailEnabled && (
                    <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
                      Available on Standard and Pro plans
                    </p>
                  )}
                </div>
                
                <div className="flex items-center cursor-pointer gap-3 self-end sm:self-center">
                  <Switch
                    checked={emailEnabled}
                    onCheckedChange={handleEmailToggle}
                    className={cn(
                      userPlan === 'FREE' && !emailEnabled ? "text-amber-500" : "",
                      "!cursor-pointer",
                      isEmailSettingsLoading ? "opacity-50" : ""
                    )}
                    disabled={isEmailSettingsLoading || (userPlan === 'FREE' && !emailEnabled)}
                    onClick={(e) => {
                      // Show upgrade modal when free users click the disabled switch
                      if (userPlan === 'FREE' && !emailEnabled) {
                        e.preventDefault();
                        setUpgradeFeatureName("Email Notifications");
                        setUpgradeFeatureIcon(<Mail className="h-5 w-5 m-2 text-slate-700 dark:text-slate-300" />);
                        setUpgradeFeatureDescription("Get email notifications whenever someone submits your form. Available on Standard and Pro plans.");
                        setIsUpgradeModalOpen(true);
                      }
                    }}
                  />
                  {userPlan === 'FREE' && !emailEnabled && (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 cursor-pointer px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-none"
                      onClick={() => {
                        setUpgradeFeatureName("Email Notifications");
                        setUpgradeFeatureIcon(<Mail className="h-5 w-5 m-2 text-slate-700 dark:text-slate-300" />);
                        setUpgradeFeatureDescription("Get email notifications whenever someone submits your form. Available on Standard and Pro plans.");
                        setIsUpgradeModalOpen(true);
                      }}
                      disabled={isEmailSettingsLoading}
                    >
                      Upgrade
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Users Joined Counter (For Waitlist Forms Only) */}
          {(formType?.toUpperCase() === 'WAITLIST' || formType === 'waitlist') && (
            <div className="mt-6 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-600 dark:text-zinc-500" />
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Users Joined</h4>
                  </div>
                  <div className="flex items-center">
                    {userPlan === 'FREE' && !usersJoinedEnabled && (
                      <div className="mr-3 px-2 py-0.5 text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-800/50">
                        Premium Feature
                      </div>
                    )}
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-lg",
                      usersJoinedEnabled 
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" 
                        : "bg-zinc-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-500"
                    )}>
                      {usersJoinedEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white dark:bg-zinc-900">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Show how many people have joined your waitlist to create social proof and increase conversions.
                    </p>
                    {usersJoinedEnabled && usersJoinedSettings?.count !== undefined && (
                      <div className="mt-2 flex items-center">
                        <div className="inline-flex items-center px-3 py-1 text-sm bg-zinc-50 dark:bg-zinc-900/20 text-blue-700 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-800/50">
                          <Users className="w-3.5 h-3.5 mr-1.5" />
                          <span>{usersJoinedSettings.count.toLocaleString()} users joined</span>
                        </div>
                      </div>
                    )}
                    {userPlan === 'FREE' && !usersJoinedEnabled && (
                      <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
                        Available on Standard and Pro plans
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center cursor-pointer gap-3 self-end sm:self-center">
                    <Switch
                      checked={usersJoinedEnabled}
                      onCheckedChange={handleUsersJoinedToggle}
                      className={cn(
                        userPlan === 'FREE' && !usersJoinedEnabled ? "text-amber-500" : "",
                        "!cursor-pointer",
                        isUsersJoinedSettingsLoading ? "opacity-50" : ""
                      )}
                      disabled={isUsersJoinedSettingsLoading || (userPlan === 'FREE' && !usersJoinedEnabled)}
                      onClick={(e) => {
                        // Show upgrade modal when free users click the disabled switch
                        if (userPlan === 'FREE' && !usersJoinedEnabled) {
                          e.preventDefault();
                          setUpgradeFeatureName("Users Joined Counter");
                          setUpgradeFeatureIcon(<Users className="h-5 w-5 m-2 text-slate-700 dark:text-slate-300" />);
                          setUpgradeFeatureDescription("Show how many people have joined your waitlist to create social proof and increase conversions. Available on Standard and Pro plans.");
                          setIsUpgradeModalOpen(true);
                        }
                      }}
                    />
                    {userPlan === 'FREE' && !usersJoinedEnabled && (
                      <Button
                        variant="default"
                        size="sm"
                        className="h-8 cursor-pointer px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-none"
                        onClick={() => {
                          setUpgradeFeatureName("Users Joined Counter");
                          setUpgradeFeatureIcon(<Users className="h-5 w-5 m-2 text-slate-700 dark:text-slate-300" />);
                          setUpgradeFeatureDescription("Show how many people have joined your waitlist to create social proof and increase conversions. Available on Standard and Pro plans.");
                          setIsUpgradeModalOpen(true);
                        }}
                        disabled={isUsersJoinedSettingsLoading}
                      >
                        Upgrade
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-gray-600 dark:text-zinc-500" />
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Export Submissions</h4>
                </div>
                <div className="flex items-center">
                  {userPlan === 'FREE' && (
                    <div className="mr-3 px-2 py-0.5 text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-800/50">
                      Premium Feature
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white dark:bg-zinc-900">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Export your form submissions to CSV format for advanced analysis and record keeping.
                  </p>
                  {userPlan === 'FREE' && (
                    <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
                      Available on Standard and Pro plans
                    </p>
                  )}
                </div>
                
                <div className="flex items-center cursor-pointer gap-3 self-end sm:self-center">
                  {userPlan === 'FREE' ? (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 cursor-pointer px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-none"
                      onClick={() => {
                        setUpgradeFeatureName("Export Submissions");
                        setUpgradeFeatureIcon(<Download className="h-5 w-5 m-2 text-slate-700 dark:text-slate-300" />);
                        setUpgradeFeatureDescription("Export your form submissions to CSV format for advanced analysis and record keeping. Available on Standard and Pro plans.");
                        setIsUpgradeModalOpen(true);
                      }}
                    >
                      Upgrade to Export
                    </Button>
                  ) : (
                    <div className="mt-4">
                      <ExportSubmissions formId={formId} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <DeleteForm 
        formId={formId}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onOpen={() => setIsDeleteModalOpen(true)}  // Add this line
      />

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        featureName={upgradeFeatureName}
        featureIcon={upgradeFeatureIcon}
        description={upgradeFeatureDescription}
      />
    </div>
  );
}