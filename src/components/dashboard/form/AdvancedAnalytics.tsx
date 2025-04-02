"use client"

import * as React from "react"
import {
  Lock,
  UserRound,
  Rocket,
  CreditCard,
  GlobeIcon,
  Chrome,
  MonitorSmartphone,
  CircleIcon,
  Globe,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UpgradeModal } from "@/components/modals/UpgradeModal"
import { BrowserAndLocationStats } from "@/components/dashboard/form/BrowserAndLocationStats"

interface UserInsight {
  type: string
  value: string
  percentage: number
}

interface BrowserStat {
  name: string
  count: number
  percentage: number
  icon?: React.ReactNode
}

interface CountryStat {
  name: string
  count: number
  percentage: number
}

interface AdvancedAnalyticsProps {
  activeTab: "insights"
  hasPremiumAccess: boolean
  userInsights: UserInsight[]
  isCollapsed: boolean
  browserStats?: BrowserStat[]
  locationStats?: CountryStat[]
}

export function AdvancedAnalytics({
  activeTab,
  hasPremiumAccess,
  userInsights,
  isCollapsed,
  browserStats = [],
  locationStats = [],
}: AdvancedAnalyticsProps) {
  const [showPaywall, setShowPaywall] = React.useState(false)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false)

  // Debug logs for incoming props
  React.useEffect(() => {
    console.log("🔍 AdvancedAnalytics Component Mount/Update:", {
      hasPremiumAccess,
      browserStats,
      locationStats,
      userInsights,
      isCollapsed,
      showPaywall,
      isUpgradeModalOpen
    })
  }, [hasPremiumAccess, browserStats, locationStats, userInsights, isCollapsed, showPaywall, isUpgradeModalOpen])

  // When tab changes, reset paywall state
  React.useEffect(() => {
    console.log("🔄 Tab Changed - Resetting Paywall State")
    setShowPaywall(false)
  }, [activeTab])

  const getBrowserIcon = (browserName: string) => {
    console.log("🎨 Getting Browser Icon for:", browserName)
    switch (browserName.toLowerCase()) {
      case "chrome":
        return <Chrome className="h-4 w-4 xs:h-4.5 xs:w-4.5 sm:h-5 sm:w-5 text-white dark:text-zinc-900" />
      case "safari":
      case "mobile safari":
        return <MonitorSmartphone className="h-4 w-4 xs:h-4.5 xs:w-4.5 sm:h-5 sm:w-5 text-white dark:text-zinc-900" />
      case "firefox":
        return <CircleIcon className="h-4 w-4 xs:h-4.5 xs:w-4.5 sm:h-5 sm:w-5 text-white dark:text-zinc-900" />
      case "edge":
        return <Globe className="h-4 w-4 xs:h-4.5 xs:w-4.5 sm:h-5 sm:w-5 text-white dark:text-zinc-900" />
      default:
        return <GlobeIcon className="h-4 w-4 xs:h-4.5 xs:w-4.5 sm:h-5 sm:w-5 text-white dark:text-zinc-900" />
    }
  }

  // Transform browser stats with icons
  const browsersWithIcons = React.useMemo(() => {
    console.log("🔄 Transforming Browser Stats:", browserStats)
    const transformed = browserStats.map((browser) => ({
      ...browser,
      icon: getBrowserIcon(browser.name),
    }))
    console.log("✅ Transformed Browser Stats:", transformed)
    return transformed
  }, [browserStats])

  // Debug log for transformed data
  React.useEffect(() => {
    console.log("📊 AdvancedAnalytics Transformed Data:", {
      browsersWithIcons,
      locationStats,
      hasPremiumAccess,
      showPaywall,
    })
  }, [browsersWithIcons, locationStats, hasPremiumAccess, showPaywall])

  return (
    <>
      <div className={`transition-all duration-300 ${isCollapsed ? "max-h-0 opacity-0" : ""}`}>
        {!hasPremiumAccess && showPaywall ? (
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm w-full rounded-lg sm:rounded-xl">
            <CardHeader className="pb-2 pt-3 px-3 xs:px-4 sm:px-4">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <div className="h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 xs:h-4.5 xs:w-4.5 sm:h-5 sm:w-5 text-zinc-500" />
                </div>
              </div>
              <CardTitle className="text-center text-zinc-900 dark:text-white text-sm xs:text-base">
                Premium Feature
              </CardTitle>
              <CardDescription className="text-center text-zinc-600 dark:text-zinc-400 text-[10px] xs:text-xs">
                Upgrade to Standard or Pro plan to access detailed user insights
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center px-3 xs:px-4 sm:px-4 pb-3">
              <div className="space-y-2 mb-3">
                <div className="p-1.5 xs:p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-md text-[10px] xs:text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="items-center">
                    <div>
                      <p className="pl-0">
                        Understand who your users are, how they access your forms, and optimize for their needs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 xs:gap-2">
                  <div className="p-1.5 xs:p-2 border border-zinc-200 dark:border-zinc-800 rounded-md text-center">
                    <p className="text-[10px] xs:text-xs text-zinc-600 dark:text-zinc-400 mb-0.5 xs:mb-1">Browsers</p>
                    <p className="text-xs xs:text-sm font-medium text-zinc-900 dark:text-white mt-0.5">
                      <Lock className="h-2.5 w-2.5 xs:h-3 xs:w-3 inline-block mr-1 mb-0.5 align-text-bottom" />
                      Premium
                    </p>
                  </div>
                  <div className="p-1.5 xs:p-2 border border-zinc-200 dark:border-zinc-800 rounded-md text-center">
                    <p className="text-[10px] xs:text-xs text-zinc-600 dark:text-zinc-400 mb-0.5 xs:mb-1">Locations</p>
                    <p className="text-xs xs:text-sm font-medium text-zinc-900 dark:text-white mt-0.5">
                      <Lock className="h-2.5 w-2.5 xs:h-3 xs:w-3 inline-block mr-1 mb-0.5 align-text-bottom" />
                      Premium
                    </p>
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                className="bg-zinc-900 cursor-pointer dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 w-full h-8 xs:h-9 text-xs xs:text-sm"
                onClick={() => setIsUpgradeModalOpen(true)}
              >
                <Rocket className="h-3.5 w-3.5 xs:h-4 xs:w-4 mr-1.5 xs:mr-2" />
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        ) : !hasPremiumAccess ? (
          <Card
            onClick={() => setShowPaywall(true)}
            className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all w-full rounded-lg sm:rounded-xl"
          >
            <CardHeader className="pb-2 pt-3 px-3 xs:px-4 sm:px-4 flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-zinc-900 dark:text-white text-xs xs:text-sm flex items-center">
                  User Insights
                </CardTitle>
                <CardDescription className="text-zinc-600 dark:text-zinc-400 text-[10px] xs:text-xs">
                  Discover who's using your form
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-center px-3 xs:px-4 sm:px-4 pb-3">
              <div className="py-3 xs:py-4 flex flex-col items-center">
                <div className="h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-1.5 xs:mb-2">
                  <Lock className="h-3.5 w-3.5 xs:h-4 xs:w-4 text-zinc-500 dark:text-zinc-400" />
                </div>
                <p className="text-xs xs:text-sm font-medium text-zinc-800 dark:text-zinc-200">View User Insights</p>
                <p className="text-[10px] xs:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 xs:mt-1 max-w-[180px] xs:max-w-[220px] mx-auto">
                  Click to upgrade and see detailed analytics about your users
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 xs:space-y-5 sm:space-y-6 w-full">
            {/* Browser and Location Stats Component */}
            <BrowserAndLocationStats browsers={browsersWithIcons} locations={locationStats} isLoading={false} />
          </div>
        )}
      </div>

      {isUpgradeModalOpen && (
        <UpgradeModal
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
          featureName="Advanced Analytics"
          featureIcon={
            <UserRound className="h-4 w-4 xs:h-4.5 xs:w-4.5 sm:h-5 sm:w-5 text-slate-700 dark:text-slate-300" />
          }
          description="Get detailed insights about your users including their browser usage and locations to optimize your forms."
        />
      )}
    </>
  )
}

