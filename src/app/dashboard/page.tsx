// src/app/dashboard/page.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { 
  PlusCircle, 
  FileText, 
  Inbox, 
  ArrowRight, 
  BarChart3, 
  TrendingUp,
  BadgeCheck, 
  AlertTriangle
} from "lucide-react"
// import { DashboardStatsCards } from "@/components/dashboard/dashboard-stats-cards"
// import { RecentSubmissions } from "@/components/dashboard/recent-submissions"
// import { RecentForms } from "@/components/dashboard/recent-forms"
// import { UsageChart } from "@/components/dashboard/usage-chart"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 mt-10">
      <div className="flex items-center justify-between">
        <div>

          <p className="text-muted-foreground">
            Welcome back to FormsQuay! Here's an overview of your forms and submissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/forms">
              View Forms
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/forms/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Form
            </Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<DashboardStatsSkeleton />}>
        {/* <DashboardStatsCards /> */}
      </Suspense>

      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="usage">Usage & Quota</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  Recent Forms
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-0">
                <Suspense fallback={<ListSkeleton count={3} />}>
                  {/* <RecentForms limit={5} /> */}
                </Suspense>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link href="/dashboard/forms">
                    View all forms
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  Recent Submissions
                </CardTitle>
                <Inbox className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-0">
                <Suspense fallback={<ListSkeleton count={5} />}>
                  {/* <RecentSubmissions limit={5} /> */}
                </Suspense>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link href="/dashboard/submissions">
                    View all submissions
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Usage</CardTitle>
              <CardDescription>
                Your subscription plan includes 1,000 submissions per month
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Suspense fallback={<div className="h-[300px] flex items-center justify-center"><Skeleton className="h-[250px] w-full" /></div>}>
                {/* <UsageChart /> */}
              </Suspense>
              
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2 rounded-lg border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <BadgeCheck className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="ml-1">
                    <p className="text-sm font-medium">Current Plan</p>
                    <p className="text-xs text-muted-foreground">Free Plan (50 submissions/month)</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 rounded-lg border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="ml-1">
                    <p className="text-sm font-medium">Usage Alert</p>
                    <p className="text-xs text-muted-foreground">You've used 12/50 submissions (24%)</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">View Usage History</Button>
              <Button size="sm">Upgrade Plan</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-9 w-16" />
            <Skeleton className="mt-1 h-4 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ListSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="px-6 flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-12" />
        </div>
      ))}
    </div>
  )
}