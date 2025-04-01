import { useQuery } from "@tanstack/react-query"
import { client } from "@/lib/client"

type Plan = 'FREE' | 'PRO' | 'STANDARD'

interface Subscription {
  plan: Plan
}

export function useSubscription() {
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
    retry: 3,
    staleTime: 30000,
  })

  const isPremium = subscription?.plan === 'PRO' || subscription?.plan === 'STANDARD'

  return {
    subscription,
    isLoading,
    isPremium,
  }
} 