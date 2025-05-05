import { useQuery } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { useUser } from "@clerk/nextjs"

type Plan = 'FREE' | 'PRO' | 'STANDARD'

interface Subscription {
  plan: Plan
}

export function useSubscription() {
  const { isSignedIn } = useUser()
  
  const { data: subscription, isLoading } = useQuery<Subscription>({
    queryKey: ["subscription"],
    queryFn: async () => {
      try {
        const response = await client.user.getUserPlan.$get()
        const data = await response.json()
        return data
      } catch (error) {
        console.error("Error fetching subscription:", error)
        return { plan: 'FREE' }
      }
    },
    retry: 2,
    staleTime: 30000,
    enabled: !!isSignedIn,
  })

  const isPremium = subscription?.plan === 'PRO' || subscription?.plan === 'STANDARD'
  const userPlan = subscription?.plan || 'FREE'

  return {
    subscription,
    isLoading,
    isPremium,
    userPlan,
  }
} 