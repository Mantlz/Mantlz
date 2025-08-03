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
      className="hidden sm:flex items-center gap-1.5 bg-amber-500 dark:bg-amber-500 hover:bg-amber-600 text-white hover:text-white border-amber-500 transition-all duration-200"
    >
      <Sparkles className="h-4 w-4" />
      <span>Upgrade</span>
    </Button>
  )
}