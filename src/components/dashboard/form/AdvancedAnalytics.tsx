"use client"

import * as React from "react"
import {
  Lock,
  UserRound,
  Rocket,
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

  }, [hasPremiumAccess, browserStats, locationStats, userInsights, isCollapsed, showPaywall, isUpgradeModalOpen])

  // When tab changes, reset paywall state
  React.useEffect(() => {

    setShowPaywall(false)
  }, [activeTab])

  const getBrowserIcon = (browserName: string) => {

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

    const transformed = browserStats.map((browser) => ({
      ...browser,
      icon: getBrowserIcon(browser.name),
    }))

    return transformed
  }, [browserStats])

  // Debug log for transformed data
  React.useEffect(() => {

  }, [browsersWithIcons, locationStats, hasPremiumAccess, showPaywall])

  return (
    <>
      <div className={`transition-all duration-300 ${isCollapsed ? "max-h-0 opacity-0" : ""}`}>
        {!hasPremiumAccess && showPaywall ? (
          <Card className="border-zinc-200 dark:border-zinc-800 bg-background dark:bg-background shadow-none w-full rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
              <CardTitle className="text-center text-zinc-900 dark:text-white text-lg sm:text-xl mb-2">
                Premium Feature
              </CardTitle>
              <CardDescription className="text-center text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
                Upgrade to Standard or Pro plan to access detailed user insights
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center px-4 sm:px-5 pb-5">
              <div className="space-y-3 mb-4">
                <div className="p-3 sm:p-4  rounded-lg text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
                  <div className="items-center">
                    <div>
                      <p className="pl-0">
                        Understand who your users are, how they access your forms, and optimize for their needs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 sm:p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg text-center">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Browsers</p>
                      <Lock className="h-4 w-4 inline-block mr-2 mb-0.5 align-text-bottom" />
                    {/* <p className="text-base font-medium text-zinc-900 dark:text-white mt-1">
                      Premium
                    </p> */}
                  </div>
                  <div className="p-3 sm:p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg text-center">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Locations</p>
                      <Lock className="h-4 w-4 inline-block mr-2 align-text-bottom" />
                    {/* <p className="text-base font-medium text-zinc-900 dark:text-white mt-1">
                      
                    </p> */}
                  </div>
                </div>
              </div>

              <Button
                size="default"
              className="h-10 px-2 text-md bg-amber-500 text-white dark:text-black dark:border-background border text-sm  ring ring-inset ring-white/20 transition-[filter] duration-200 hover:brightness-125 active:brightness-95"

                onClick={() => setIsUpgradeModalOpen(true)}
              >
                <Rocket className="h-5 w-5 mr-2" />
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        ) : !hasPremiumAccess ? (
          <Card
            onClick={() => setShowPaywall(true)}
            className=" shadow-none border-zinc-200 bg-background dark:bg-background dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all w-full rounded-lg sm:rounded-xl"
          >
            <CardHeader className="pb-2 pt-4 px-4 sm:px-5 flex flex-row items-start justify-center content-center space-y-0">
            </CardHeader>
            <CardContent className="text-center px-4 sm:px-5 pb-4">
              <div className="py-4 sm:py-5 flex flex-col items-center">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-accent/80 flex items-center justify-center mb-2 ">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <p className="text-base sm:text-lg font-medium text-zinc-800 dark:text-zinc-300 mb-2">View User Insights</p>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-[240px] sm:max-w-[280px] mx-auto">
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

