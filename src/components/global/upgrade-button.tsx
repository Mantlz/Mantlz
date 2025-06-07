import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { client } from "@/lib/client"
import { useQuery } from "@tanstack/react-query"

type Plan = "FREE" | "STANDARD" | "PRO"

type UserPlan = {
  plan: Plan
}

export function UpgradeButton() {
  const router = useRouter()
  
  const { data: userPlan, isLoading } = useQuery<UserPlan>({
    queryKey: ['userPlan'],
    queryFn: async () => {
      const response = await client.user.getUserPlan.$get()
      const data = await response.json()
      return { plan: data.plan }
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep data in cache for 30 minutes
  })

  if (isLoading || !userPlan || userPlan.plan === "PRO") {
    return null
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.push("/pricing")}
      className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-orange-500/10 to-orange-500/10 hover:from-orange-500/20 hover:to-orange-500/20 border-orange-500/50 text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-all duration-200"
    >
      <Sparkles className="h-4 w-4" />
      <span>Upgrade</span>
    </Button>
  )
} 