import { Calendar, Copy, Share, ExternalLink, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { Switch } from "@/components/ui/switch"

import { toast } from 'sonner';
import { useState, useEffect } from 'react';

import { client } from '@/lib/client';
import { UpgradeModal } from "@/components/modals/UpgradeModal";

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
      <Card className="p-5  bg-gradient-to-br from-zinc-100 via-zinc-100/50 to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900 border-none rounded-lg shadow-md mb-6">



          
        
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