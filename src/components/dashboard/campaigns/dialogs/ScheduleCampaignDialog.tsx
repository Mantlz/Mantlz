"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Clock, CalendarDays } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { client } from "@/lib/client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { UpgradeModal } from "@/components/modals/UpgradeModal"
import { createPortal } from "react-dom"

interface ScheduleCampaignDialogProps {
  campaignId: string
  onScheduled: () => void
  isPremium: boolean
  onUpgradeClick?: () => void
  userPlan: string
}

export function ScheduleCampaignDialog({ campaignId, onScheduled, onUpgradeClick, userPlan }: ScheduleCampaignDialogProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("09:00 AM")
  const [loading, setLoading] = useState(false)
  const [period, setPeriod] = useState<"AM" | "PM">("AM")
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [recipientType, setRecipientType] = useState<"first" | "last" | "custom">("first")
  const [customRecipientCount, setCustomRecipientCount] = useState<number>(100)
  const [isMounted, setIsMounted] = useState(false)

  // Ensure component is mounted before rendering portals
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

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

      // Validate custom recipient count
      if (recipientType === "custom" && (customRecipientCount < 1 || customRecipientCount > 200)) {
        toast.error("Please enter a number between 1 and 200")
        return
      }

      await client.campaign.schedule.$post({
        campaignId,
        scheduleDate: scheduleDate.toISOString(),
        recipientSettings: {
          type: recipientType,
          count: recipientType === "custom" ? customRecipientCount : 100
        }
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

  // Only open one dialog at a time and ensure they don't conflict
  useEffect(() => {
    if (showUpgradeModal) {
      setOpen(false)
    }
  }, [showUpgradeModal])

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 px-3 text-sm cursor-pointer gap-2 bg-white hover:bg-purple-50 text-purple-600 border-gray-200 dark:bg-zinc-800 dark:hover:bg-purple-900/20 dark:text-purple-400 rounded-lg transition-all duration-200"
        onClick={handleScheduleClick}
      >
        <CalendarDays className="h-4 w-4" />
        Schedule
      </Button>

      {/* Scheduling Dialog - Only shown for Pro users */}
      {!showUpgradeModal && (
        <Dialog open={open && isProUser} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[900px] p-0 rounded-lg border-0 shadow-lg">
            <DialogHeader className="p-6 bg-white dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700">
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">Schedule Campaign</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                Configure your campaign schedule in three simple steps
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 bg-white dark:bg-zinc-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1: Recipients */}
                <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-400 font-medium">1</span>
                    </div>
                    <Label className="text-base font-medium text-gray-900 dark:text-white">
                      Select Recipients
                    </Label>
                  </div>

                  <RadioGroup 
                    value={recipientType} 
                    onValueChange={(value) => setRecipientType(value as "first" | "last" | "custom")}
                    className="flex flex-col gap-2"
                  >
                    {[
                      { value: "first", label: "First 100 subscribers" },
                      { value: "last", label: "Last 100 subscribers" },
                      { value: "custom", label: "Custom number" }
                    ].map(({ value, label }) => (
                      <div key={value} 
                        className={cn(
                          "flex items-center space-x-3 p-2.5 rounded-md transition-all duration-200 cursor-pointer",
                          recipientType === value 
                            ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                            : "hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300"
                        )}
                      >
                        <RadioGroupItem value={value} id={value} className="text-purple-600 dark:text-purple-400 cursor-pointer" />
                        <Label htmlFor={value} className="text-sm flex-1 cursor-pointer">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  {recipientType === "custom" && (
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-zinc-700 rounded-md">
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          min={1}
                          max={200}
                          value={customRecipientCount}
                          onChange={(e) => setCustomRecipientCount(Number(e.target.value))}
                          className="w-24 h-9 text-sm rounded-md border-gray-200 dark:border-zinc-700 focus:ring-purple-500 dark:focus:ring-purple-400"
                        />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          subscribers (max 200)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Column 2: Date Selection */}
                <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-400 font-medium">2</span>
                    </div>
                    <Label className="text-base font-medium text-gray-900 dark:text-white">
                      Select Date
                    </Label>
                  </div>

                  <div className="rounded-md overflow-hidden bg-gray-50 dark:bg-zinc-700">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3"
                    />
                  </div>
                </div>

                {/* Column 3: Time Selection */}
                <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-400 font-medium">3</span>
                    </div>
                    <Label className="text-base font-medium text-gray-900 dark:text-white">
                      Select Time
                    </Label>
                  </div>

                  <div>
                    {/* AM/PM Toggle */}
                    <div className="flex mb-3 bg-gray-50 dark:bg-zinc-700 rounded-md p-1">
                      {["AM", "PM"].map((p) => (
                        <button
                          key={p}
                          onClick={() => setPeriod(p as "AM" | "PM")}
                          className={cn(
                            "flex-1 py-1.5 text-sm font-medium transition-all duration-200 rounded cursor-pointer",
                            period === p
                              ? "bg-purple-500 text-white dark:bg-purple-600"
                              : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    {/* Time Grid */}
                    <div className="bg-gray-50 dark:bg-zinc-700 rounded-md p-2">
                      <div className="grid grid-cols-3 gap-1.5">
                        {timeOptions.map((time) => {
                          const timeString = `${time} ${period}`
                          const isSelected = selectedTime === timeString

                          return (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(timeString)}
                              className={cn(
                                "py-2 px-1 rounded text-sm transition-all duration-200 cursor-pointer",
                                isSelected
                                  ? "bg-purple-500 text-white dark:bg-purple-600"
                                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-600"
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
              </div>

              {/* Preview Section */}
              {date && (
                <div className="mt-6 flex items-center gap-3 p-4 bg-white dark:bg-zinc-800 rounded-lg border border-gray-100 dark:border-zinc-700">
                  <div className="w-9 h-9 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">
                      Campaign Schedule Summary
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Sending to {recipientType === "custom" ? customRecipientCount : 100} {recipientType === "first" ? "first" : recipientType === "last" ? "last" : ""} subscribers on {format(date, "MMMM d, yyyy")} at {selectedTime}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-gray-100 dark:border-zinc-700 bg-white dark:bg-zinc-800">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setOpen(false)}
                className="h-9 px-4 text-sm bg-white hover:bg-gray-50 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-gray-300 dark:border-zinc-700 rounded-md transition-all duration-200 cursor-pointer"
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleSchedule} 
                disabled={loading || !date}
                className="h-9 px-4 text-sm bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-md transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Scheduling..." : "Schedule Campaign"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Upgrade Modal - Rendered in a portal for isolation */}
      {isMounted && showUpgradeModal && createPortal(
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          featureName="Campaign Scheduling"
          featureIcon={<CalendarDays className="h-5 w-5 m-2 text-slate-700 dark:text-slate-300" />}
          description="Schedule your campaigns to be sent at the perfect time. Available on Pro plan."
        />,
        document.body
      )}
    </>
  )
} 