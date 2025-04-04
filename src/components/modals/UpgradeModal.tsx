import { Mail, BarChart, Maximize2, Bell, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  featureIcon?: React.ReactNode;
  description?: string;
}

const featureDescriptions: Record<string, { icon: React.ReactNode; description: string }> = {
  "Detailed Submission View": {
    icon: <Maximize2 className="h-5 w-5 m-2 text-slate-700 dark:text-slate-300" />,
    description: "Get access to detailed submission information including form data, email status, and analytics. Perfect for tracking and analyzing form responses."
  },
  "Analytics Dashboard": {
    icon: <BarChart className="h-5 w-5 m-2 text-slate-700 dark:text-slate-300" />,
    description: "Unlock powerful analytics to understand your form's performance, user behavior, and submission patterns."
  },
  "Developer Notifications": {
    icon: <Bell className="h-5 w-5 m-2 text-slate-700 dark:text-slate-300" />,
    description: "Receive instant notifications for form submissions, ensuring you never miss a response."
  },
  "Form Templates": {
    icon: <FileText className="h-5 w-5 text-slate-700 dark:text-slate-300" />,
    description: "Access a library of pre-built form templates to speed up your form creation process."
  }
};

export function UpgradeModal({ 
  isOpen, 
  onClose, 
  featureName,
  featureIcon,
  description
}: UpgradeModalProps) {
  if (!isOpen) return null;
  
  const featureInfo = featureDescriptions[featureName] || {
    icon: <Mail className="h-5 w-5 text-slate-700 dark:text-slate-300" />,
    description: "This premium feature is available on Standard and Pro plans. Upgrade now to enhance your forms."
  };

  const icon = featureIcon || featureInfo.icon;
  const featureDescription = description || featureInfo.description;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-md max-w-md w-full border border-slate-200 dark:border-zinc-800 shadow-xl">
        {/* Subtle gradient background */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-zinc-900/50 dark:to-zinc-800/50 pointer-events-none" /> */}
      
        {/* Accent line */}
        <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-500" />
        
        {/* Modern minimal header */}
        <div className="relative -mt-6 -mx-6 mb-5 bg-zinc-100 dark:bg-black p-6 rounded-t-md border-b border-slate-200 dark:border-zinc-800">
          <div className="absolute top-0 left-0 w-full h-px bg-slate-100 dark:bg-white/10"></div>
          <h2 className="text-black dark:text-white text-xl font-medium tracking-tight flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-slate-800 dark:bg-white inline-block"></span>
            <span>Upgrade Required</span>
          </h2>
        </div>
        
        {/* Content with monochromatic design */}
        <div className="space-y-5">
          <div className="flex items-start">
            <div className="mr-4 h-10 w-10 flex items-center justify-center rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-medium text-black dark:text-white">{featureName}</h3>
              <p className="text-sm text-black dark:text-white mt-1">
                {featureDescription}
              </p>
            </div>
          </div>
          
          {/* Modern comparison table with hover effects */}
          <div className="mt-4 rounded-md border border-slate-200 dark:border-zinc-800 overflow-hidden">
            <div className="bg-slate-100 dark:bg-zinc-950 py-2 px-4 border-b border-slate-200 dark:border-zinc-800">
              <p className="text-sm font-medium text-black dark:text-white">Plan Comparison</p>
            </div>
            
            <div className="divide-y divide-slate-200 dark:divide-zinc-800">
              <div className="flex justify-between py-3 px-4 items-center hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-default">
                <span className="font-medium text-black dark:text-white text-sm">FREE</span>
                <span className="text-black dark:text-white flex items-center text-sm">
                  <span className="rounded-full h-2 w-2 bg-slate-300 dark:bg-zinc-700 mr-2"></span>
                  Basic form features
                </span>
              </div>
              
              <div className="flex justify-between py-3 px-4 items-center hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-default">
                <span className="font-medium text-black dark:text-white text-sm">STANDARD</span>
                <span className="text-black dark:text-white flex items-center text-sm">
                  <span className="rounded-full h-2 w-2 bg-slate-800 dark:bg-white mr-2"></span>
                  Advanced features & analytics
                </span>
              </div>
              
              <div className="flex justify-between py-3 px-4 items-center hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-default">
                <span className="font-medium text-black dark:text-white text-sm">PRO</span>
                <span className="text-black dark:text-white flex items-center text-sm">
                  <span className="rounded-full h-2 w-2 bg-slate-800 dark:bg-white mr-2"></span>
                  Everything in Standard
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