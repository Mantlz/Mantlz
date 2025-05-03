"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SettingsStepProps {
  settings: {
    fromEmail: string
    replyTo: string
    scheduledAt: Date | null
  }
  onUpdate: (settings: {
    fromEmail: string
    replyTo: string
    scheduledAt: Date | null
  }) => void
}

export function SettingsStep({ settings, onUpdate }: SettingsStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fromEmail">From Email</Label>
          <Input
            id="fromEmail"
            type="email"
            value={settings.fromEmail}
            onChange={(e) => onUpdate({ ...settings, fromEmail: e.target.value })}
            placeholder="noreply@yourdomain.com"
          />
          <p className="text-sm text-gray-500">
            This is the email address that will appear in the From field
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="replyTo">Reply-To Email</Label>
          <Input
            id="replyTo"
            type="email"
            value={settings.replyTo}
            onChange={(e) => onUpdate({ ...settings, replyTo: e.target.value })}
            placeholder="contact@yourdomain.com"
          />
          <p className="text-sm text-gray-500">
            Replies to your campaign will be sent to this address
          </p>
        </div>

        <div className="space-y-2">
          <Label>Schedule Send</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !settings.scheduledAt && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {settings.scheduledAt ? (
                  format(settings.scheduledAt, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={settings.scheduledAt || undefined}
                onSelect={(date) => onUpdate({ ...settings, scheduledAt: date || null })}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <p className="text-sm text-gray-500">
            Choose when to send your campaign. Leave empty to send immediately.
          </p>
        </div>
      </div>
    </div>
  )
} 