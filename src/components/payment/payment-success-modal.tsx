"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { client } from "@/lib/client"

export function PaymentSuccessModal() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessModalContent />
    </Suspense>
  )
}

function PaymentSuccessModalContent() {
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  
  // Check if we should show the modal
  const showModal = searchParams.get("payment") === "success"
  
  // Fetch the user's current plan
  const { data: userPlan, isLoading } = useQuery({
    queryKey: ["userPlan"],
    queryFn: async () => {
      const response = await client.user.getUserPlan.$get()
      const data = await response.json()
      return data.plan
    },
    enabled: showModal,
  })
  
  // Open the modal when the component mounts if payment=success is in the URL
  useEffect(() => {
    if (showModal) {
      setIsOpen(true)
      
      // Remove the payment parameter from the URL without refreshing the page
      const url = new URL(window.location.href)
      url.searchParams.delete("payment")
      window.history.replaceState({}, "", url.toString())
    }
  }, [showModal])
  
  // Close the modal and stay on the dashboard
  const handleClose = () => {
    setIsOpen(false)
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-zinc-900 rounded-md max-w-md w-full border border-slate-200 dark:border-zinc-800 shadow-xl overflow-hidden">
        {/* Accent line */}
        <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-500" />
        
        {/* Modern minimal header */}
        <div className="relative bg-zinc-100 dark:bg-black p-6 border-b border-slate-200 dark:border-zinc-800">
          <div className="absolute top-0 left-0 w-full h-px bg-slate-100 dark:bg-white/10"></div>
          <h2 className="text-black dark:text-white text-xl font-medium tracking-tight flex items-center space-x-2 text-center justify-center">

            <span>Payment Successful</span>
          </h2>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-center text-black dark:text-white">Processing your payment...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center mb-6">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800">
                  <CheckIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-medium text-black dark:text-white mb-2">Thank you for your payment!</h3>
                <p className="text-sm text-black dark:text-white">
                  Your account has been upgraded to the <span className="font-medium">{userPlan}</span> plan.
                </p>
              </div>
              
              {/* Minimal modern buttons */}
              <div className="flex justify-center w-full">
                <Button 
                  onClick={handleClose}
                  className="bg-slate-800  hover:bg-slate-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white transition-colors font-medium text-sm cursor-pointer px-6"
                >
                  Continue to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 