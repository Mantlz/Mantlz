import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { toast } from "sonner"
import { client } from "@/lib/client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { UpgradeModal } from "@/components/modals/UpgradeModal"

interface SendCampaignDialogProps {
  campaignId: string
  onSent: () => void
  onUpgradeClick?: () => void
  userPlan: string
}

export function SendCampaignDialog({ 
  campaignId, 
  onSent, 
  onUpgradeClick, 
  userPlan 
}: SendCampaignDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [recipientType, setRecipientType] = useState<"first" | "last" | "custom">("first")
  const [customRecipientCount, setCustomRecipientCount] = useState<number>(100)

  const isProUser = userPlan === 'PRO'
  const isStandardUser = userPlan === 'STANDARD'

  const handleSendClick = () => {
    if (!isProUser && !isStandardUser) {
      setOpen(false)
      onUpgradeClick?.()
      return
    }
    setOpen(true)
  }

  const handleSend = async () => {
    if (!isProUser && !isStandardUser) {
      setOpen(false)
      onUpgradeClick?.()
      return
    }

    try {
      setLoading(true)

      // Validate custom recipient count
      if (recipientType === "custom" && (customRecipientCount < 1 || customRecipientCount > 200)) {
        toast.error("Please enter a number between 1 and 200")
        return
      }

      await client.campaign.send.$post({
        campaignId,
        recipientSettings: {
          type: recipientType,
          count: recipientType === "custom" ? customRecipientCount : 100
        }
      })

      toast.success("Campaign sent successfully")
      setOpen(false)
      onSent()
    } catch (error) {
      console.error("Error sending campaign:", error)
      toast.error("Failed to send campaign")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="h-7 px-2 text-xs cursor-pointer gap-1 bg-white hover:bg-zinc-100 text-gray-600 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-gray-300 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-all duration-200"
        onClick={handleSendClick}
      >
        <Send className="h-3.5 w-3.5" />
        Send Now
      </Button>

      {/* Sending Dialog - Only shown for Pro users */}
      <Dialog open={open && (isProUser || isStandardUser)} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px] p-0">
          <DialogHeader className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <DialogTitle className="text-lg font-medium text-gray-900 dark:text-white">Send Campaign</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
              Choose your recipients and send your campaign
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 space-y-4">
            {/* Recipient Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Recipients
              </Label>
              <div className="space-y-2">
                <RadioGroup 
                  value={recipientType} 
                  onValueChange={(value) => setRecipientType(value as "first" | "last" | "custom")}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="first" id="first" />
                    <Label htmlFor="first" className="text-sm text-gray-600 dark:text-gray-300">
                      First 100 subscribers
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="last" id="last" />
                    <Label htmlFor="last" className="text-sm text-gray-600 dark:text-gray-300">
                      Last 100 subscribers
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="text-sm text-gray-600 dark:text-gray-300">
                      Custom number
                    </Label>
                  </div>
                </RadioGroup>

                {recipientType === "custom" && (
                  <div className="pl-6 pt-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={200}
                        value={customRecipientCount}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setCustomRecipientCount(Math.min(Math.max(value, 1), 200));
                        }}
                        className="w-24 h-8 text-sm"
                      />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        subscribers (max 200)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800/50">
              <Send className="h-4 w-4 text-orange-500" />
              <p className="text-sm text-orange-900 dark:text-orange-300">
                Sending to {recipientType === "custom" ? customRecipientCount : 100} {recipientType === "first" ? "first" : recipientType === "last" ? "last" : ""} subscribers
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-3 border-t border-zinc-200 dark:border-zinc-800">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 text-xs bg-white dark:bg-zinc-900"
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleSend} 
              disabled={loading}
              className="h-8 text-xs bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? "Sending..." : "Send Campaign"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade Modal - Only shown for Standard users */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Campaign Sending"
        featureIcon={<Send className="h-5 w-5 m-2 text-slate-700 dark:text-slate-300" />}
        description="Send campaigns to your subscribers with advanced recipient selection. Available on Pro plan."
      />
    </>
  )
} 