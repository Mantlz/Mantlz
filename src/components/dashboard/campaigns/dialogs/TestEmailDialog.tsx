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
  campaignStatus: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED' | 'CANCELLED'
}

export function TestEmailDialog({ 
  campaignId, 
  isOpen, 
  onClose,
  onUpgradeClick,
  userPlan,
  campaignStatus
}: TestEmailDialogProps) {
  const [loading, setLoading] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { user } = useUser()

  const isPaidUser = userPlan === 'PRO' || userPlan === 'STANDARD'
  const isDraft = campaignStatus === 'DRAFT'

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

    if (!isDraft) {
      toast.error("Test emails can only be sent for draft campaigns")
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
      {isOpen && !showUpgradeModal && (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 border-0 shadow-xl">
            <DialogHeader className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Send Test Email
                </DialogTitle>
              </div>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                Verify your campaign content and settings before sending to your audience.
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 space-y-5">
              {/* Recipient Info */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        Test Recipient
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-0.5">
                        {user?.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                  </div>
                  {isPaidUser && isDraft && (
                    <span className="px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                      Ready
                    </span>
                  )}
                </div>
              </div>

              {/* Status Messages */}
              {!isPaidUser && (
                <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
                  <AlertCircle className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Upgrade Required
                    </h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Test emails are available on Standard and Pro plans
                    </p>
                  </div>
                </div>
              )}

              {!isDraft && isPaidUser && (
                <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
                  <AlertCircle className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Campaign Not in Draft
                    </h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Test emails can only be sent for draft campaigns
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-6 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleTestEmail}
                disabled={loading || !isPaidUser || !isDraft}
                className={`px-4 py-2 text-sm font-medium ${isPaidUser && isDraft ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-gray-400 text-white cursor-not-allowed'}`}
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {!isPaidUser ? 'Upgrade Required' : !isDraft ? 'Not Available' : 'Send Test'}
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Upgrade Modal */}
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