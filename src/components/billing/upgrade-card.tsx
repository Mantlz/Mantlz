import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { client } from "@/lib/client"
import { useQuery } from "@tanstack/react-query"
import { FREE_QUOTA, STANDARD_QUOTA, PRO_QUOTA } from "@/config/usage"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap, ArrowRight } from "lucide-react"

export function UpgradeCard() {
  const router = useRouter()
  const { user } = useUser()

  const { data: usageData, isLoading } = useQuery({
    queryKey: ["usage"],
    queryFn: async () => {
      const response = await client.usage.getUsage.$get()
      return response.json()
    },
  })

  if (isLoading || !usageData) {
    return (
      <Card className="mx-auto mb-4 max-w-xl w-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <CardHeader className="pb-2 pt-3 px-4 flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-zinc-900 dark:text-white text-sm flex items-center">
              <div className="h-4 w-4 mr-2 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            </CardTitle>
            <CardDescription className="mt-1">
              <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            </CardDescription>
          </div>
          <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </CardHeader>
        
        <CardContent className="px-4 pb-3 flex items-center justify-center">
          <div className="grid gap-2 p-2 max-w-lg w-full">
            {/* Forms Usage Skeleton */}
            <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-950 px-2 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="bg-white dark:bg-zinc-900 rounded-full p-1.5 border border-zinc-200 dark:border-zinc-800">
                <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              </div>
              <div className="flex flex-1 items-center justify-between gap-2">
                <div className="h-3 w-12 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>

            {/* Submissions Usage Skeleton */}
            <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-950 px-2 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="bg-white dark:bg-zinc-900 rounded-full p-1.5 border border-zinc-200 dark:border-zinc-800">
                <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              </div>
              <div className="flex flex-1 items-center justify-between gap-2">
                <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-6 pb-2">
          <div className="w-full h-8 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </CardFooter>
      </Card>
    )
  }

  // Don't show the card for PRO users
  if (usageData.plan === "PRO") {
    return null
  }

  const currentQuota = usageData.plan === "STANDARD" ? STANDARD_QUOTA : FREE_QUOTA
  const nextQuota = usageData.plan === "STANDARD" ? PRO_QUOTA : STANDARD_QUOTA

  return (
    <Card className="mx-auto mb-4 max-w-xl w-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <CardHeader className="pb-2 pt-3 px-4 flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-zinc-900 dark:text-white text-sm flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-zinc-500" />
            {usageData.plan === "FREE" ? "Standard Plan" : "Pro Plan"}
          </CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400 text-xs">
            {usageData.plan === "FREE" 
              ? "Unlock more power with Standard"
              : "Go Pro for maximum potential"}
          </CardDescription>
        </div>
        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200 whitespace-nowrap">
          {usageData.plan === "FREE" ? "STANDARD" : "PRO"}
        </Badge>
      </CardHeader>
      
      <CardContent className="px-4 pb-3 flex items-center justify-center">
        <div className="grid gap-2 p-2 max-w-lg">
          <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-950 px-2 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-full p-1.5 border border-zinc-200 dark:border-zinc-800">
              <Zap className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div className="flex flex-1 items-center justify-between gap-2">
              <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                Forms
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono whitespace-nowrap">
                {usageData.formsUsed || 0}/{currentQuota.maxForms} → {nextQuota.maxForms}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-950 px-2 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-full p-1.5 border border-zinc-200 dark:border-zinc-800">
              <Zap className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div className="flex flex-1 items-center justify-between gap-2">
              <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                Submissions
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono whitespace-nowrap">
                {usageData.submissionsUsed || 0}/{currentQuota.maxSubmissionsPerMonth} → {nextQuota.maxSubmissionsPerMonth}
              </span>
            </div>
          </div>

          {usageData.plan === "STANDARD" && (
            <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-950 px-2 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="bg-white dark:bg-zinc-900 rounded-full p-1.5 border border-zinc-200 dark:border-zinc-800">
                <Sparkles className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              </div>
              <div className="flex flex-1 items-center justify-between gap-2">
                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  Pro Features
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Dev Notifications
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-6 pb-2">
        <Button 
          className="w-full h-8 bg-zinc-300 hover:bg-purple-700 dark:bg-zinc-600 dark:hover:bg-purple-700"
          onClick={() => router.push("/settings/billing")}
        >
          <span>Upgrade Now</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
