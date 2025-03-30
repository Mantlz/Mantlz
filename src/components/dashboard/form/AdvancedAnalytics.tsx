"use client"

import * as React from "react"
import { Lock, UserRound, AlertCircle, Rocket, Loader2, CreditCard } from "lucide-react"
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

interface UserInsight {
  type: string;
  value: string;
  percentage: number;
}

interface AdvancedAnalyticsProps {
  activeTab: 'insights';
  hasPremiumAccess: boolean;
  userInsights: UserInsight[];
  isCollapsed: boolean;
}

export function AdvancedAnalytics({
  activeTab,
  hasPremiumAccess,
  userInsights,
  isCollapsed
}: AdvancedAnalyticsProps) {
  const [showPaywall, setShowPaywall] = React.useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false);
  
  // When tab changes, reset paywall state
  React.useEffect(() => {
    setShowPaywall(false);
  }, [activeTab]);
  
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
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Devices</p>
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
            {/* User Profile & Behavior Card */}
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
              <div className="flex flex-col space-y-1 p-3">
                <h3 className="text-sm font-medium text-zinc-900 dark:text-white flex items-center">
                  <UserRound className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
                  User Profile & Behavior
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Insights based on user device, location, and activity patterns
                </p>
              </div>
              <div className="p-3 pt-0">
                {userInsights.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {userInsights.map((insight) => (
                      <div key={insight.type} className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-md">
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">{insight.type}</p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm font-medium text-zinc-900 dark:text-white truncate mr-1">{insight.value}</p>
                          <Badge className={cn(
                            "flex-shrink-0 font-medium text-xs",
                            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                          )}>
                            {(insight.percentage * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <Progress 
                          value={insight.percentage * 100} 
                          className="h-1 mt-1.5 bg-zinc-100 dark:bg-zinc-800"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-md text-center">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-1">Collecting user insights data...</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">As more users complete your form, details about their devices, locations, and activity patterns will appear here.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Optimization Opportunities Card */}
            {userInsights.length > 0 && (
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                <div className="flex justify-between items-start p-3 pb-1.5">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-white flex items-center">
                      <Rocket className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
                      Optimization Tips
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Recommendations based on your user data
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 font-medium text-xs flex-shrink-0">
                    Tips
                  </Badge>
                </div>
                <div className="p-3 pt-0">
                  <div className="p-2 border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 rounded-md text-xs text-emerald-800 dark:text-emerald-300">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium mb-0.5">Based on your analytics:</p>
                        <p className="break-words">
                          {userInsights.find(i => i.type === "Device")?.value ? `${Math.round((userInsights.find(i => i.type === "Device")?.percentage || 0) * 100)}% use ${userInsights.find(i => i.type === "Device")?.value}` : ''} {userInsights.find(i => i.type === "OS")?.value ? `running ${userInsights.find(i => i.type === "OS")?.value}` : ''}. Most submissions occur during the {userInsights.find(i => i.type === "Peak Activity")?.value?.toLowerCase() || 'day'}.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {isUpgradeModalOpen && (
        <UpgradeModal 
          isOpen={isUpgradeModalOpen} 
          onClose={() => setIsUpgradeModalOpen(false)}
          featureName="Advanced Analytics"
          featureIcon={<UserRound className="h-5 w-5 text-slate-700 dark:text-slate-300" />}
          description="Get detailed insights about your users including their devices, locations, and activity patterns to optimize your forms."
        />
      )}
    </>
  )
} 