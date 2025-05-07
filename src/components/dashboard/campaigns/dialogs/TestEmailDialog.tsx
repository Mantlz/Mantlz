import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Send, Mail, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { sendCampaignTestEmail, checkTestEmailStatus } from "@/actions/campaign-actions"
import { UpgradeModal } from "@/components/modals/UpgradeModal"
import { useUser } from "@clerk/nextjs"
import { createPortal } from "react-dom"

interface TestEmailDialogProps {
  campaignId: string
  isOpen: boolean
  onClose: () => void
  onUpgradeClick?: () => void
  userPlan: string
}

export function TestEmailDialog({ 
  campaignId, 
  isOpen, 
  onClose,
  onUpgradeClick,
  userPlan
}: TestEmailDialogProps) {
  const [loading, setLoading] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { user } = useUser()

  const isPaidUser = userPlan === 'PRO' || userPlan === 'STANDARD'

  // Ensure component is mounted before rendering portals
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Only open one dialog at a time and ensure they don't conflict
  useEffect(() => {
    if (showUpgradeModal && isOpen) {
      onClose()
    }
  }, [showUpgradeModal, isOpen, onClose])

  const handleTestEmail = async () => {
    if (!isPaidUser) {
      onUpgradeClick?.()
      onClose()
      return
    }

    try {
      setLoading(true)
      const result = await sendCampaignTestEmail(campaignId)

      if (result.success) {
        // Show initial toast and close dialog
        const toastId = toast.loading("Sending test email...") as string
        onClose()
        
        // Start polling for status if we have a testId
        if (result.testId) {
          pollTestStatus(result.testId, toastId)
        }
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Error sending test email:", error)
      toast.error("Failed to send test email")
    } finally {
      setLoading(false)
    }
  }

  const pollTestStatus = async (testId: string, toastId: string) => {
    let attempts = 0
    const maxAttempts = 30
    const interval = 1000

    const checkStatus = async () => {
      try {
        const result = await checkTestEmailStatus(testId)
        
        if (result.status === "sent" || result.status === "delivered") {
          toast.success("Test email sent successfully", {
            id: toastId,
          })
          return true
        }
        
        if (result.status === "failed") {
          toast.error(`Test email failed: ${result.error || "Unknown error"}`, {
            id: toastId,
          })
          return true
        }

        if (result.status === "error") {
          toast.error("Error checking test email status", {
            id: toastId,
          })
          return true
        }

        return false
      } catch (error) {
        console.error("Error polling test status:", error)
        toast.error("Error checking email status", {
          id: toastId,
        })
        return true
      }
    }

    const poll = async () => {
      if (attempts >= maxAttempts) {
        toast.error("Email sent but delivery status unknown", {
          id: toastId,
        })
        return
      }

      const isDone = await checkStatus()
      if (!isDone && attempts < maxAttempts) {
        attempts++
        setTimeout(poll, interval)
      }
    }

    poll()
  }

  return (
    <>
      {/* Main Dialog - Only shown for Paid users */}
      {isOpen && !showUpgradeModal && (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="sm:max-w-[450px] p-0 gap-0">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <Mail className="h-5 w-5 text-purple-500" />
                Send Test Email
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Send a test email to verify your campaign content and settings.
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 pt-2 space-y-4">
              {/* Email Info Box */}
              <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4 border border-gray-100 dark:border-zinc-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <Mail className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Recipient
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.emailAddresses[0]?.emailAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="flex items-start gap-2 px-1">
                <AlertCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This test email will help you preview how your campaign will look in recipients&apos; inboxes.
                  {!isPaidUser && " This feature requires a Standard or Pro plan."}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-4"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleTestEmail}
                  disabled={loading || !isPaidUser}
                  className={`${isPaidUser ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-400'} text-white px-4 shadow-sm`}
                >
                  {loading ? (
                    <>
                      <Mail className="mr-2 h-4 w-4 animate-pulse" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {isPaidUser ? 'Send Test' : 'Upgrade Required'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Upgrade Modal - Rendered in a portal for isolation */}
      {isMounted && showUpgradeModal && createPortal(
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          featureName="Campaign Testing"
          featureIcon={<Mail className="h-5 w-5 m-2 text-slate-700 dark:text-slate-300" />}
          description="Test your campaigns before sending them to ensure everything looks perfect. Available on Pro plan."
        />,
        document.body
      )}
    </>
  )
} 