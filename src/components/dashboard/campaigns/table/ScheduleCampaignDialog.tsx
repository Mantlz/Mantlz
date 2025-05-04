"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Clock, CalendarDays } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { client } from "@/lib/client"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { UpgradeModal } from "@/components/modals/UpgradeModal"

interface ScheduleCampaignDialogProps {
  campaignId: string
  onScheduled: () => void
  isPremium: boolean
  onUpgradeClick?: () => void
  userPlan: string
}

export function ScheduleCampaignDialog({ campaignId, onScheduled, isPremium, onUpgradeClick, userPlan }: ScheduleCampaignDialogProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("09:00 AM")
  const [loading, setLoading] = useState(false)
  const [period, setPeriod] = useState<"AM" | "PM">("AM")
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const isProUser = userPlan === 'PRO'
  const isStandardUser = userPlan === 'STANDARD'

  // Simple time options
  const timeOptions = [
    "09:00", "10:00", "11:00", "12:00",
    "01:00", "02:00", "03:00", "04:00", "05:00"
  ]

  const handleScheduleClick = () => {
    if (!isProUser && isStandardUser) {
      setOpen(false)
      setShowUpgradeModal(true)
      return
    }
    if (!isProUser) {
      setOpen(false)
      onUpgradeClick?.()
      return
    }
    setOpen(true)
  }

  const handleSchedule = async () => {
    if (!isProUser) {
      if (isStandardUser) {
        setOpen(false)
        setShowUpgradeModal(true)
      } else {
        setOpen(false)
        onUpgradeClick?.()
      }
      return
    }

    try {
      setLoading(true)

      if (!date) {
        toast.error("Please select a date")
        return
      }

      // Parse time and set schedule date
      const [timeValue] = selectedTime.split(' ')
      if (!timeValue) {
        toast.error("Invalid time format")
        return
      }
      
      const [hours, minutes] = timeValue.split(':').map(Number)
      if (typeof hours !== 'number' || typeof minutes !== 'number') {
        toast.error("Invalid time format")
        return
      }
      
      let hour = hours

      // Convert to 24-hour format
      if (period === 'PM' && hour !== 12) hour += 12
      if (period === 'AM' && hour === 12) hour = 0

      const scheduleDate = new Date(date)
      scheduleDate.setHours(hour, minutes, 0, 0)

      // Validate future date
      if (scheduleDate <= new Date()) {
        toast.error("Please select a future date and time")
        return
      }

      await client.campaign.schedule.$post({
        campaignId,
        scheduleDate: scheduleDate.toISOString()
      })

      toast.success("Campaign scheduled successfully")
      setOpen(false)
      onScheduled()
    } catch (error) {
      console.error("Error scheduling campaign:", error)
      toast.error("Failed to schedule campaign")
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
        onClick={handleScheduleClick}
      >
        <CalendarDays className="h-3.5 w-3.5" />
        Schedule
      </Button>

      {/* Scheduling Dialog - Only shown for Pro users */}
      <Dialog open={open && isProUser} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px] p-0">
          <DialogHeader className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <DialogTitle className="text-lg font-medium text-gray-900 dark:text-white">Schedule Campaign</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
              Choose when to send your campaign
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 space-y-4">
            {/* Date Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Select Date
              </Label>
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-2"
                />
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Select Time
              </Label>
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900">
                {/* AM/PM Toggle */}
                <div className="flex border-b border-zinc-200 dark:border-zinc-800">
                  {["AM", "PM"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p as "AM" | "PM")}
                      className={cn(
                        "flex-1 px-3 py-2 text-sm font-medium transition-colors duration-200",
                        period === p
                          ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-b-2 border-purple-500"
                          : "text-gray-600 dark:text-gray-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Time Grid */}
                <div className="p-2">
                  <div className="grid grid-cols-3 gap-1">
                    {timeOptions.map((time) => {
                      const timeString = `${time} ${period}`
                      const isSelected = selectedTime === timeString

                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(timeString)}
                          className={cn(
                            "py-2 px-1 rounded-lg text-sm transition-colors duration-200",
                            isSelected
                              ? "bg-purple-500 text-white font-medium"
                              : "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                          )}
                        >
                          {time}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            {date && (
              <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/50">
                <Clock className="h-4 w-4 text-purple-500" />
                <p className="text-sm text-purple-900 dark:text-purple-300">
                  Sending on <span className="font-medium">{format(date, "MMM d")} at {selectedTime}</span>
                </p>
              </div>
            )}
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
              onClick={handleSchedule} 
              disabled={loading || !date}
              className="h-8 text-xs bg-purple-500 hover:bg-purple-600 text-white"
            >
              {loading ? "Scheduling..." : "Schedule Campaign"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade Modal - Only shown for Standard users */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Campaign Scheduling"
        featureIcon={<CalendarDays className="h-5 w-5 m-2 text-slate-700 dark:text-slate-300" />}
        description="Schedule your campaigns to be sent at the perfect time. Available on Pro plan."
      />
    </>
  )
} 