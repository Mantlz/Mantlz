"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value?: Date
  onChange?: (date?: Date) => void
  placeholder?: string
}

export function DatePicker({ value, onChange, placeholder = "Pick a date" }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            "bg-white dark:bg-zinc-900",
            "border border-gray-200 dark:border-zinc-800",
            "text-gray-900 dark:text-white",
            "cursor-pointer",

            "hover:bg-gray-50 dark:hover:bg-zinc-800",
            "shadow-sm",
            "h-9 px-3 py-2",
            !value && "text-gray-500 dark:text-gray-400"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            className={cn(
              "p-3",
              "cursor-pointer",
              "[&_.rdp-months]:flex [&_.rdp-months]:flex-col [&_.rdp-months]:sm:flex-row [&_.rdp-months]:gap-2",
              "[&_.rdp-month]:flex [&_.rdp-month]:flex-col [&_.rdp-month]:gap-4",
              "[&_.rdp-caption]:flex [&_.rdp-caption]:justify-center [&_.rdp-caption]:pt-1 [&_.rdp-caption]:relative [&_.rdp-caption]:items-center [&_.rdp-caption]:w-full",
              "[&_.rdp-caption_label]:text-sm [&_.rdp-caption_label]:font-medium",
              "[&_.rdp-nav]:flex [&_.rdp-nav]:items-center [&_.rdp-nav]:gap-1",
              "[&_.rdp-nav_button]:size-7 [&_.rdp-nav_button]:bg-transparent [&_.rdp-nav_button]:p-0 [&_.rdp-nav_button]:opacity-50 [&_.rdp-nav_button]:hover:opacity-100",
              "[&_.rdp-nav_button_previous]:absolute [&_.rdp-nav_button_previous]:left-1",
              "[&_.rdp-nav_button_next]:absolute [&_.rdp-nav_button_next]:right-1",
              "[&_.rdp-table]:w-full [&_.rdp-table]:border-collapse [&_.rdp-table]:space-x-1",
              "[&_.rdp-head_row]:flex",
              "[&_.rdp-head_cell]:text-gray-500 [&_.rdp-head_cell]:rounded-md [&_.rdp-head_cell]:w-8 [&_.rdp-head_cell]:font-normal [&_.rdp-head_cell]:text-[0.8rem]",
              "[&_.rdp-row]:flex [&_.rdp-row]:w-full [&_.rdp-row]:mt-2",
              "[&_.rdp-cell]:relative [&_.rdp-cell]:p-0 [&_.rdp-cell]:text-center [&_.rdp-cell]:text-sm [&_.rdp-cell]:focus-within:relative [&_.rdp-cell]:focus-within:z-20",
              "[&_.rdp-day]:size-8 [&_.rdp-day]:p-0 [&_.rdp-day]:font-normal [&_.rdp-day]:aria-selected:opacity-100",
              "[&_.rdp-day_selected]:bg-gray-900 [&_.rdp-day_selected]:text-white [&_.rdp-day_selected]:hover:bg-gray-800 [&_.rdp-day_selected]:focus:bg-gray-800",
              "[&_.rdp-day_today]:bg-gray-100 [&_.rdp-day_today]:text-gray-900",
              "[&_.rdp-day_outside]:text-gray-400 [&_.rdp-day_outside]:aria-selected:text-gray-400",
              "[&_.rdp-day_disabled]:text-gray-400 [&_.rdp-day_disabled]:opacity-50",
              "[&_.rdp-day_hidden]:invisible"
            )}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
} 