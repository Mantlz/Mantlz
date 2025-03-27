import { Calendar, Copy, Share, ExternalLink, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { Switch } from "@/components/ui/switch"

import { toast } from 'sonner';
import { useState, useEffect } from 'react';

import { client } from '@/lib/client';

interface FormHeaderProps {
  id: string
  name: string
  createdAt?: Date | string
  responsesCount?: number
  emailSettings?: {
    enabled: boolean;
    fromEmail?: string;
    subject?: string;
    template?: string;
    replyTo?: string;
  }
  onRefresh?: () => void
}

export function FormHeader({ id, name, createdAt, responsesCount = 0, emailSettings, onRefresh }: FormHeaderProps) {
  const [emailEnabled, setEmailEnabled] = useState(emailSettings?.enabled ?? false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);

  // Fetch user plan on component mount
  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const response = await client.usage.getUsage.$get();
        const data = await response.json();
        setUserPlan(data.plan);
      } catch (error) {
        console.error("Failed to fetch user plan:", error);
      }
    };
    
    fetchUserPlan();
  }, []);

  const copyId = () => {
    if (id) {
      navigator.clipboard.writeText(id)
      toast.success('Form ID copied to clipboard', {
        description: `ID: ${id}`,
        duration: 2000,
      })
    }
  }

  const handleEmailToggle = async (checked: boolean) => {
    // No need to check for FREE plan here since the switch is disabled for them
    
    // Immediately update UI state for responsiveness
    setEmailEnabled(checked);
    
    try {
      await client.forms.toggleEmailSettings.$post({
        formId: id,
        enabled: checked
      });
      
      toast.success('Email notifications ' + (checked ? 'enabled' : 'disabled'));
      
      // Refresh form data to ensure UI is in sync
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      // Revert state if update fails
      setEmailEnabled(!checked);
      console.error('Failed to update email settings:', error);
      toast.error('Failed to update email settings');
    }
  };

  // Convert string to Date if needed
  const createdAtDate = createdAt 
    ? (createdAt instanceof Date ? createdAt : new Date(createdAt))
    : new Date();

  return (
    <>
      <Card className="p-5  bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-800 border-none rounded-lg shadow-md mb-6">



              {/* Subtle gradient background */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-zinc-900/50 dark:to-zinc-800/50 pointer-events-none" /> */}
      
      {/* Accent line */}
      {/* <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-500" /> */}
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-xl font-medium text-slate-900 dark:text-slate-50">{name}</h1>
            <div className="flex items-center mt-2 text-sm text-slate-600 dark:text-slate-400">
              <Calendar className="h-4 w-4 mr-1" />
              Created {format(createdAtDate, "MMM d, yyyy")}
              {responsesCount > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <span>{responsesCount} {responsesCount === 1 ? 'response' : 'responses'}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-zinc-950 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow duration-200 h-[52px] w-full sm:w-auto">
              <div className="bg-slate-200 dark:bg-zinc-800 rounded-full p-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 tracking-tight">Email Notifications</span>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {userPlan === 'FREE' ? (
                    <span className="flex items-center">
                      <span className="text-amber-500 font-semibold">Premium feature</span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-xs h-6 px-2 cursor-pointer text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 -my-1 ml-1" 
                        onClick={() => setIsUpgradeModalOpen(true)}
                      >
                        Upgrade
                      </Button>
                    </span>
                  ) : (
                    <span className={emailEnabled ? "text-emerald-500" : "text-slate-500 dark:text-slate-400"}>
                      {emailEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  )}
                </span>
              </div>
              <div className={`w-px h-8 mx-1 ${userPlan === 'FREE' ? 'bg-amber-200 dark:bg-amber-800/30' : 'bg-slate-200 dark:bg-zinc-700'}`}></div>
              <Switch
                checked={emailEnabled}
                onCheckedChange={handleEmailToggle}
                className={`ml-1 ${userPlan === 'FREE' ? 'cursor-not-allowed opacity-70' : ''}`}
                disabled={userPlan === 'FREE' && !emailEnabled}
              />
            </div>
            
            {id && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-3 cursor-pointer bg-slate-100 dark:bg-zinc-950 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow duration-200 h-[52px] w-full sm:w-auto"
                onClick={copyId}
              >
                <Copy className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Copy ID</span>
              </Button>
            )}
          </div>
        </div>
      </Card>
      
      {isUpgradeModalOpen && (
        <UpgradeModal 
          isOpen={isUpgradeModalOpen} 
          onClose={() => setIsUpgradeModalOpen(false)}
          featureName="Email notifications"
        />
      )}
    </>
  )
}

// Simple upgrade modal component
interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

function UpgradeModal({ isOpen, onClose, featureName }: UpgradeModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-md max-w-md w-full border border-slate-200 dark:border-zinc-800 shadow-xl">

              {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-zinc-900/50 dark:to-zinc-800/50 pointer-events-none" />
      
      {/* Accent line */}
      <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-500" />
        {/* Modern minimal header */}
        <div className="relative -mt-6 -mx-6 mb-5  bg-zinc-100 dark:bg-black p-6 rounded-t-md border-b border-slate-200 dark:border-zinc-800">
          <div className="absolute top-0 left-0 w-full h-px  bg-slate-100 dark:bg-white/10"></div>
          <h2 className="text-slate-900 dark:text-white text-xl font-medium tracking-tight flex items-center space-x-2">
            <span className="w-2 h-2  rounded-full bg-slate-800 dark:bg-white inline-block"></span>
            <span>Upgrade Required</span>
          </h2>
        </div>
        
        {/* Content with monochromatic design */}
        <div className="space-y-5">
          <div className="flex items-start">
            <div className="mr-4 h-10 w-10 flex items-center justify-center rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
              <Mail className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">{featureName}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                This premium feature is available on Standard and Pro plans. Upgrade now to enhance your forms with automated email notifications.
              </p>
            </div>
          </div>
          
          {/* Modern comparison table with hover effects */}
          <div className="mt-4 rounded-md border border-slate-200 dark:border-zinc-800 overflow-hidden">
            <div className="bg-slate-100 dark:bg-zinc-950 py-2 px-4 border-b border-slate-200 dark:border-zinc-800">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Plan Comparison</p>
            </div>
            
            <div className="divide-y divide-slate-200 dark:divide-zinc-800">
              <div className="flex justify-between py-3 px-4 items-center hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-default">
                <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">FREE</span>
                <span className="text-slate-500 dark:text-slate-500 flex items-center text-sm">
                  <span className="rounded-full h-2 w-2 bg-slate-300 dark:bg-zinc-700 mr-2"></span>
                  No email notifications
                </span>
              </div>
              
              <div className="flex justify-between py-3 px-4 items-center hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-default">
                <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">STANDARD</span>
                <span className="text-slate-700 dark:text-slate-300 flex items-center text-sm">
                  <span className="rounded-full h-2 w-2 bg-slate-800 dark:bg-white mr-2"></span>
                  Email notifications
                </span>
              </div>
              
              <div className="flex justify-between py-3 px-4 items-center hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-default">
                <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">PRO</span>
                <span className="text-slate-700 dark:text-slate-300 flex items-center text-sm">
                  <span className="rounded-full h-2 w-2 bg-slate-800 dark:bg-white mr-2"></span>
                  Advanced customization
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Minimal modern buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors font-medium text-sm cursor-pointer"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => window.location.href = '/settings/billing'}
            className="bg-slate-800 hover:bg-slate-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white transition-colors font-medium text-sm cursor-pointer"
          >
            Upgrade Plan
          </Button>
        </div>
      </div>
    </div>
  );
} 