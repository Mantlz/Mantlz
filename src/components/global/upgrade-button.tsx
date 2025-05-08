import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { client } from "@/lib/client"

type Plan = "FREE" | "STANDARD" | "PRO"

type UserPlan = {
  plan: Plan
}

export function UpgradeButton() {
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const response = await client.user.getUserPlan.$get()
        const data = await response.json()
        setUserPlan({ plan: data.plan })
      } catch (error) {
        console.error("Failed to fetch user plan:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserPlan()
  }, [])

  if (loading || !userPlan || userPlan.plan === "PRO") {
    return null
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.push("/pricing")}
      className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-violet-500/10 to-purple-500/10 hover:from-violet-500/20 hover:to-purple-500/20 border-violet-500/50 text-violet-700 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-all duration-200"
    >
      <Sparkles className="h-4 w-4" />
      <span>Upgrade</span>
    </Button>
  )
} 