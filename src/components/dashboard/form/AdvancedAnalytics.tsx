"use client"

import * as React from "react"
import { Lock, UserRound, AlertCircle, Rocket, Loader2, CreditCard, GlobeIcon, Chrome, MonitorSmartphone, CircleIcon, Globe } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UpgradeModal } from "@/components/modals/UpgradeModal"
import { BrowserAndLocationStats } from "@/components/dashboard/form/BrowserAndLocationStats"

interface UserInsight {
  type: string;
  value: string;
  percentage: number;
}

interface BrowserStat {
  name: string;
  count: number;
  percentage: number;
  icon?: React.ReactNode;
}

interface CountryStat {
  name: string;
  count: number;
  percentage: number;
}

interface AdvancedAnalyticsProps {
  activeTab: 'insights';
  hasPremiumAccess: boolean;
  userInsights: UserInsight[];
  isCollapsed: boolean;
  browserStats?: BrowserStat[];
  locationStats?: CountryStat[];
}

export function AdvancedAnalytics({
  activeTab,
  hasPremiumAccess,
  userInsights,
  isCollapsed,
  browserStats = [],
  locationStats = []
}: AdvancedAnalyticsProps) {
  const [showPaywall, setShowPaywall] = React.useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false);
  
  // When tab changes, reset paywall state
  React.useEffect(() => {
    setShowPaywall(false);
  }, [activeTab]);
  
  const getBrowserIcon = (browserName: string) => {
    switch (browserName.toLowerCase()) {
      case 'chrome':
        return <Chrome className="h-4 w-4 text-slate-500 dark:text-zinc-400" />;
      case 'safari':
      case 'mobile safari':
        return <MonitorSmartphone className="h-4 w-4 text-slate-500 dark:text-zinc-400" />;
      case 'firefox':
        return <CircleIcon className="h-4 w-4 text-slate-500 dark:text-zinc-400" />;
      case 'edge':
        return <Globe className="h-4 w-4 text-slate-500 dark:text-zinc-400" />;
      default:
        return <GlobeIcon className="h-4 w-4 text-slate-500 dark:text-zinc-400" />;
    }
  };

  const browsersWithIcons = browserStats.map(browser => ({
    ...browser,
    icon: getBrowserIcon(browser.name)
  }));
  
  return (
    <>
      <div className={`transition-all duration-300 ${
        isCollapsed ? 'max-h-0 opacity-0' : ''
      }`}>
        {!hasPremiumAccess && showPaywall ? (
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm w-full">
            <CardHeader className="pb-2 pt-3 px-4">
              <div className="flex items-center justify-center mb-2">
                <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-zinc-500" />
                </div>
              </div>
              <CardTitle className="text-center text-zinc-900 dark:text-white text-base">
                Premium Feature
              </CardTitle>
              <CardDescription className="text-center text-zinc-600 dark:text-zinc-400 text-xs">
                Upgrade to Standard or Pro plan to access detailed user insights
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center px-4 pb-3">
              <div className="space-y-2 mb-3">
                <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-md text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="items-center">
                    <div>
                      <p className="pl-0 ">
                        Understand who your users are, how they access your forms, and optimize for their needs.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 ">
                  <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-md text-center">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Browsers</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white mt-0.5">
                      <Lock className="h-3 w-3 inline-block mr-1 mb-0.5 align-text-bottom" />
                      Premium
                    </p>
                  </div>
                  <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-md text-center">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Locations</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white mt-0.5">
                      <Lock className="h-3 w-3 inline-block mr-1  mb-0.5 align-text-bottom" />
                      Premium
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                size="sm" 
                className="bg-zinc-900 cursor-pointer dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 w-full"
                onClick={() => setIsUpgradeModalOpen(true)}
              >
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        ) : !hasPremiumAccess ? (
          <Card 
            onClick={() => setShowPaywall(true)} 
            className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all w-full"
          >
            <CardHeader className="pb-2 pt-3 px-4 flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-zinc-900 dark:text-white text-sm flex items-center">
                  User Insights
                </CardTitle>
                <CardDescription className="text-zinc-600 dark:text-zinc-400 text-xs">
                  Discover who's using your form
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-center px-4 pb-3">
              <div className="py-4 flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-2">
                  <Lock className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                </div>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">View User Insights</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-[220px] mx-auto">
                  Click to upgrade and see detailed analytics about your users
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 w-full">
            {/* Browser and Location Stats Component */}
            <BrowserAndLocationStats 
              browsers={browsersWithIcons}
              countries={locationStats}
              isLoading={false}
            />
          </div>
        )}
      </div>
      
      {isUpgradeModalOpen && (
        <UpgradeModal 
          isOpen={isUpgradeModalOpen} 
          onClose={() => setIsUpgradeModalOpen(false)}
          featureName="Advanced Analytics"
          featureIcon={<UserRound className="h-5 w-5 text-slate-700 dark:text-slate-300" />}
          description="Get detailed insights about your users including their browser usage and locations to optimize your forms."
        />
      )}
    </>
  )
} 