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
  const [currentStep, setCurrentStep] = useState(1)

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
    "01:00", "02:00", "03:00", "04:00", "05:00",
    "06:00", "07:00", "08:00"
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
      scheduleDate.setHours(hour, 0, 0, 0) // Set minutes and seconds to 0 for exact hour scheduling

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

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Recipients
        return (
          <div className="p-4 bg-white dark:bg-zinc-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-medium text-xs">1</span>
              </div>
              <Label className="text-base font-medium text-gray-900 dark:text-white">
                Select Recipients
              </Label>
            </div>

            <RadioGroup 
              value={recipientType} 
              onValueChange={(value) => setRecipientType(value as "first" | "last" | "custom")}
              className="mt-3 flex flex-col gap-2"
            >
              {[
                { value: "first", label: "First 100 subscribers", icon: "✉️" },
                { value: "last", label: "Last 100 subscribers", icon: "📨" },
                { value: "custom", label: "Custom number", icon: "🎯" }
              ].map(({ value, label, icon }) => (
                <div key={value} 
                  className={cn(
                    "flex items-center space-x-2 p-2.5 rounded-md transition-all duration-200 cursor-pointer border",
                    recipientType === value 
                      ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 shadow-sm"
                      : "hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 border-transparent hover:border-gray-200 dark:hover:border-zinc-600"
                  )}
                >
                  <RadioGroupItem value={value} id={value} className="text-purple-600 dark:text-purple-400 cursor-pointer" />
                  <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center mr-1">
                    <span className="text-sm" role="img" aria-label={label}>{icon}</span>
                  </div>
                  <Label htmlFor={value} className="text-sm font-medium flex-1 cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {recipientType === "custom" && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-zinc-700 rounded-md border border-gray-200 dark:border-zinc-600">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Input
                      type="number"
                      min={1}
                      max={200}
                      value={customRecipientCount}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setCustomRecipientCount(Math.min(Math.max(value, 1), 200));
                      }}
                      className="w-24 h-8 text-sm rounded-md border-gray-200 dark:border-zinc-700 focus:ring-purple-500 dark:focus:ring-purple-400 pl-8"
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center text-gray-500">
                      <span>#</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      subscribers (max 200)
                    </span>
                    <div className="h-1 bg-gray-200 dark:bg-zinc-600 rounded-full mt-1.5">
                      <div 
                        className="h-1 bg-purple-500 dark:bg-purple-600 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((customRecipientCount / 200) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      
      case 2: // Date Selection
        return (
          <div className="p-4 bg-white dark:bg-zinc-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-medium text-xs">2</span>
              </div>
              <Label className="text-base font-medium text-gray-900 dark:text-white">
                Select Date
              </Label>
            </div>

            <div className="mt-3 flex justify-center">
              <div className="rounded-lg overflow-hidden bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 shadow-sm">
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
            
            {date && (
              <div className="mt-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md border border-purple-100 dark:border-purple-800 text-center">
                <p className="text-xs font-medium text-purple-700 dark:text-purple-300">
                  Selected: {format(date, "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            )}
          </div>
        )
      
      case 3: // Time Selection
        return (
          <div className="p-4 bg-white dark:bg-zinc-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-medium text-xs">3</span>
              </div>
              <Label className="text-base font-medium text-gray-900 dark:text-white">
                Select Time
              </Label>
            </div>

            <div className="mt-3 max-w-md mx-auto">
              {/* AM/PM Toggle */}
              <div className="flex mb-3 bg-gray-50 dark:bg-zinc-700 rounded-md p-1 border border-gray-200 dark:border-zinc-600">
                {["AM", "PM"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p as "AM" | "PM")}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-medium transition-all duration-200 rounded cursor-pointer",
                      period === p
                        ? "bg-purple-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Time Grid */}
              <div className="bg-gray-50 dark:bg-zinc-700 rounded-md p-2 border border-gray-200 dark:border-zinc-600">
                <div className="grid grid-cols-3 gap-1.5">
                  {timeOptions.map((time) => {
                    const timeString = `${time} ${period}`
                    const isSelected = selectedTime === timeString

                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(timeString)}
                        className={cn(
                          "py-1.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer border",
                          isSelected
                            ? "bg-purple-600 text-white border-purple-700 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-600 border-transparent hover:border-gray-300 dark:hover:border-zinc-500"
                        )}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
                <div className="mt-2 px-2 py-1 bg-gray-100 dark:bg-zinc-600 rounded text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Campaigns are sent at the start of the selected hour</span>
                </div>
              </div>

              {/* Summary */}
              {date && (
                <div className="mt-3 p-2.5 rounded-md border border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-800/40 flex items-center justify-center shrink-0">
                      <Clock className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5">Campaign Schedule</h4>
                      <p className="text-xs text-purple-700 dark:text-purple-300">
                        <span className="font-medium">{recipientType === "custom" ? customRecipientCount : 100}</span> {recipientType === "first" ? "first" : recipientType === "last" ? "last" : ""} subscribers on {format(date, "MMM d")} at {selectedTime} (sent at the top of the hour)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
    }
  }

  // Progress Bar
  const renderProgressBar = () => {
    return (
      <div className="px-4 pt-4 bg-white dark:bg-zinc-800">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center relative">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200",
                  currentStep === step
                    ? "bg-purple-600 text-white shadow-md shadow-purple-200 dark:shadow-purple-900/30"
                    : currentStep > step
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                    : "bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-400"
                )}
              >
                {step}
              </div>
              <span className={cn(
                "text-xs mt-1.5 font-medium",
                currentStep === step
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-500 dark:text-gray-400"
              )}>
                {step === 1 ? "Recipients" : step === 2 ? "Date" : "Time"}
              </span>
              {step < 3 && (
                <div className="absolute top-4 left-[2.5rem] w-[calc(100%-1rem)] h-[2px] -z-10 bg-gray-100 dark:bg-zinc-700">
                  <div className={cn(
                    "h-full bg-purple-500 dark:bg-purple-600 transition-all duration-300",
                    currentStep > step ? "w-full" : "w-0"
                  )}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

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
          <DialogContent className="sm:max-w-[480px] p-0 border rounded-lg border-0 shadow-xl ">
            <DialogHeader className="p-4 bg-white dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700 ">
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">Schedule Campaign</DialogTitle>
              <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
                Configure when and how to send your campaign
              </DialogDescription>
            </DialogHeader>

            {renderProgressBar()}
            {renderStepContent()}

            <div className="flex justify-between p-3 border-t border-gray-100 dark:border-zinc-700 bg-white dark:bg-zinc-800">
              <Button 
                variant="outline" 
                size="sm"
                onClick={currentStep === 1 ? () => setOpen(false) : prevStep}
                className="h-8 px-3 text-xs bg-white hover:bg-gray-50 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-gray-300 dark:border-zinc-700 rounded-md transition-all duration-200 cursor-pointer"
              >
                {currentStep === 1 ? "Cancel" : "Back"}
              </Button>
              <Button 
                size="sm"
                onClick={currentStep === 3 ? handleSchedule : nextStep} 
                disabled={(loading || (currentStep === 3 && !date))}
                className="h-8 px-3 text-xs bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-md transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === 3 
                  ? (loading ? "Scheduling..." : "Schedule Campaign") 
                  : "Continue"}
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