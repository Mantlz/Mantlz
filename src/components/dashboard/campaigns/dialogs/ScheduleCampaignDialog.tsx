"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Clock, CalendarDays, Users, ChevronRight, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { client } from "@/lib/client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { UpgradeModal } from "@/components/modals/UpgradeModal"
import { createPortal } from "react-dom"
import { motion } from "framer-motion"

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
          <div className="p-5 bg-white dark:bg-zinc-800 rounded-b-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center rounded-full">
                <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <Label className="text-base font-medium text-gray-900 dark:text-white">
                Select Recipients
              </Label>
            </div>

            <RadioGroup 
              value={recipientType} 
              onValueChange={(value) => setRecipientType(value as "first" | "last" | "custom")}
              className="mt-4 flex flex-col gap-3"
            >
              {[  
                { value: "first", label: "First 100 subscribers", icon: "✉️", description: "Send to the first 100 people who subscribed" },
                { value: "last", label: "Last 100 subscribers", icon: "📨", description: "Send to your most recent subscribers" },
                { value: "custom", label: "Custom number", icon: "🎯", description: "Specify exactly how many subscribers to reach" }
              ].map(({ value, label, icon, description }) => (
                <div key={value} 
                  className={cn(
                    "flex items-start p-3 rounded-lg transition-all duration-200 cursor-pointer border",
                    recipientType === value 
                      ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 shadow-sm"
                      : "hover:bg-gray-50 dark:hover:bg-zinc-700 border-gray-100 dark:border-zinc-700 hover:border-gray-200 dark:hover:border-zinc-600"
                  )}
                  onClick={() => setRecipientType(value as "first" | "last" | "custom")}
                >
                  <div className="flex items-center h-5 mr-3">
                    <RadioGroupItem value={value} id={value} className="text-orange-600 dark:text-orange-400 cursor-pointer" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center shrink-0">
                        <span className="text-sm" role="img" aria-label={label}>{icon}</span>
                      </div>
                      <Label htmlFor={value} className="text-sm font-medium cursor-pointer text-gray-900 dark:text-white">
                        {label}
                      </Label>
                      {recipientType === value && (
                        <CheckCircle2 className="h-4 w-4 text-orange-600 dark:text-orange-400 ml-auto" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-9">{description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>

            {recipientType === "custom" && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-zinc-700 rounded-lg border border-gray-200 dark:border-zinc-600">
                <div className="flex items-center gap-3">
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
                      className="w-28 h-9 text-sm rounded-md border-gray-200 dark:border-zinc-700 focus:ring-orange-500 dark:focus:ring-orange-400 pl-8"
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center text-gray-500">
                      <span>#</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      subscribers (max 200)
                    </span>
                    <div className="h-1.5 bg-gray-200 dark:bg-zinc-600 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 dark:bg-orange-600 rounded-full transition-all duration-300"
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
          <div className="p-5 bg-white dark:bg-zinc-800 rounded-b-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center rounded-full">
                <CalendarDays className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <Label className="text-base font-medium text-gray-900 dark:text-white">
                Select Date
              </Label>
            </div>

            <div className="mt-4 flex justify-center">
              <div className="rounded-lg overflow-hidden bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 shadow-sm">
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
            
            {date && (
              <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800 text-center">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {format(date, "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            )}
          </div>
        )
      
      case 3: // Time Selection
        return (
          <div className="p-5 bg-white dark:bg-zinc-800 rounded-b-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center rounded-full">
                <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <Label className="text-base font-medium text-gray-900 dark:text-white">
                Select Time
              </Label>
            </div>

            <div className="mt-4 max-w-md mx-auto">
              {/* AM/PM Toggle */}
              <div className="flex mb-4 bg-gray-50 dark:bg-zinc-700 rounded-lg p-1 border border-gray-200 dark:border-zinc-600">
                {["AM", "PM"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p as "AM" | "PM")}
                    className={cn(
                      "flex-1 py-2 text-sm font-medium transition-all duration-200 rounded-md cursor-pointer",
                      period === p
                        ? "bg-orange-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Time Grid */}
              <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-3 border border-gray-200 dark:border-zinc-600">
                <div className="grid grid-cols-4 gap-2">
                  {timeOptions.map((time) => {
                    const timeString = `${time} ${period}`
                    const isSelected = selectedTime === timeString

                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(timeString)}
                        className={cn(
                          "py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer border",
                          isSelected
                            ? "bg-orange-600 text-white border-orange-700 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-600 border-transparent hover:border-gray-300 dark:hover:border-zinc-500"
                        )}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
                <div className="mt-3 px-3 py-2 bg-gray-100 dark:bg-zinc-600 rounded-md text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> 
                    Campaigns are sent at the start of the selected hour
                  </span>
                </div>
              </div>

              {/* Summary */}
              {date && (
                <div className="mt-4 p-4 rounded-lg border border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-white dark:from-orange-900/20 dark:to-zinc-800">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-800/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Campaign Schedule Summary</h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300 flex flex-wrap gap-1">
                        <span className="font-medium">{recipientType === "custom" ? customRecipientCount : 100}</span> 
                        {recipientType === "first" ? "first" : recipientType === "last" ? "last" : ""} subscribers on 
                        <span className="font-medium">{format(date, "MMM d")}</span> at 
                        <span className="font-medium">{selectedTime}</span>
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
    const steps = [
      { number: 1, label: "Recipients", icon: <Users className="h-3.5 w-3.5" /> },
      { number: 2, label: "Date", icon: <CalendarDays className="h-3.5 w-3.5" /> },
      { number: 3, label: "Time", icon: <Clock className="h-3.5 w-3.5" /> }
    ];
    
    return (
      <div className="px-5 pt-5 pb-2 bg-white dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-100 dark:bg-zinc-700 -z-10">
            <div 
              className="h-full bg-orange-500 dark:bg-orange-600 transition-all duration-500 ease-in-out" 
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
          </div>
          
          {/* Steps */}
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center relative z-10">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300",
                  currentStep === step.number
                    ? "bg-orange-600 text-white shadow-md ring-4 ring-orange-100 dark:ring-orange-900/30"
                    : currentStep > step.number
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                    : "bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-400"
                )}
              >
                {currentStep > step.number ? <CheckCircle2 className="h-4 w-4" /> : step.icon}
              </div>
              <span className={cn(
                "text-xs mt-2 font-medium",
                currentStep === step.number
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-gray-500 dark:text-gray-400"
              )}>
                {step.label}
              </span>
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
        className="h-9 px-4 text-sm cursor-pointer gap-2 bg-white hover:bg-orange-50 text-orange-600 border-gray-200 dark:bg-zinc-800 dark:hover:bg-orange-900/20 dark:text-orange-400 rounded-lg transition-all duration-200 shadow-sm"
        onClick={handleScheduleClick}
      >
        <CalendarDays className="h-4 w-4" />
        Schedule
      </Button>

      {/* Scheduling Dialog - Only shown for Pro users */}
      {!showUpgradeModal && (
        <Dialog open={open && isProUser} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[450px] p-0 border rounded-xl shadow-xl overflow-hidden">
            <DialogHeader className="p-4 bg-white dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <CalendarDays className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">Schedule Campaign</DialogTitle>
                  <DialogDescription className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Configure when and how to send your campaign
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {renderProgressBar()}
            {renderStepContent()}

            <div className="flex justify-between p-4 border-t border-gray-100 dark:border-zinc-700 bg-white dark:bg-zinc-800">
              <Button 
                variant="outline" 
                size="sm"
                onClick={currentStep === 1 ? () => setOpen(false) : prevStep}
                className="h-9 px-4 text-sm bg-white hover:bg-gray-50 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-gray-300 dark:border-zinc-700 rounded-md transition-all duration-200 cursor-pointer"
              >
                {currentStep === 1 ? "Cancel" : "Back"}
              </Button>
              <Button 
                size="sm"
                onClick={currentStep === 3 ? handleSchedule : nextStep} 
                disabled={(loading || (currentStep === 3 && !date))}
                className="h-9 px-4 text-sm bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-md transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {currentStep === 3 
                  ? (loading ? "Scheduling..." : "Schedule Campaign") 
                  : (
                    <>
                      Continue
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
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