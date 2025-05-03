"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function CampaignSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const formId = searchParams.get("formId")
  const startDateParam = searchParams.get("startDate")
  const endDateParam = searchParams.get("endDate")

  const [startDate, setStartDate] = useState<Date | undefined>(
    startDateParam ? new Date(startDateParam) : undefined
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    endDateParam ? new Date(endDateParam) : undefined
  )

  // Reset the dates when formId changes
  useEffect(() => {
    if (!formId) {
      setStartDate(undefined)
      setEndDate(undefined)
    }
  }, [formId])

  function applyDateFilter() {
    if (!formId) return

    const currentParams = new URLSearchParams(searchParams)
    
    if (startDate) {
      currentParams.set("startDate", format(startDate, "yyyy-MM-dd"))
    } else {
      currentParams.delete("startDate")
    }
    
    if (endDate) {
      currentParams.set("endDate", format(endDate, "yyyy-MM-dd"))
    } else {
      currentParams.delete("endDate")
    }
    
    currentParams.set("page", "1") // Reset to page 1 when applying filters
    router.push(`?${currentParams.toString()}`)
  }

  function clearDateFilter() {
    if (!formId) return
    
    setStartDate(undefined)
    setEndDate(undefined)
    
    const currentParams = new URLSearchParams(searchParams)
    currentParams.delete("startDate")
    currentParams.delete("endDate")
    currentParams.set("page", "1") // Reset to page 1 when clearing filters
    router.push(`?${currentParams.toString()}`)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
              disabled={!formId}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : "Start date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
              disabled={!formId}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : "End date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={applyDateFilter}
          disabled={!formId}
        >
          Apply Filter
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={clearDateFilter}
          disabled={!formId || (!startDate && !endDate)}
        >
          Clear Filter
        </Button>
      </div>
    </div>
  )
} 