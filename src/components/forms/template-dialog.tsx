"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { formTemplates, type FormTemplateId } from "@/types/forms/templates"
import { client } from '@/lib/client';

import { cn } from "@/lib/utils"

interface TemplateCardProps {
  template: typeof formTemplates[FormTemplateId]
  onClick: () => void
  isSelected: boolean
}

function TemplateCard({ template, onClick, isSelected }: TemplateCardProps) {
  const Icon = template.icon

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-start gap-3 sm:gap-4 lg:gap-5",
        "rounded-lg sm:rounded-xl",
        "transition-all duration-200",
        "bg-white dark:bg-zinc-900",
        "border border-gray-200 dark:border-zinc-800",
        "shadow-sm hover:shadow-md",
        "p-4 sm:p-5 lg:p-6",
        // Selected state
        isSelected && [
          "border-primary/50 dark:border-primary/50",
          "ring-2 ring-primary/20 dark:ring-primary/20",
          "bg-gradient-to-r from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-800"
        ]
      )}
    >
      <div className="flex items-center gap-3 sm:gap-4 w-full">
        <div className={cn(
          "rounded-md sm:rounded-lg",
          "p-2 sm:p-2.5 lg:p-3",
          "bg-gradient-to-r from-zinc-100 to-white dark:from-zinc-900 dark:to-zinc-800",
          "border border-gray-200 dark:border-zinc-800",
          // Selected state
          isSelected && [
            "bg-primary/10 border-primary/50",
            "dark:bg-primary/20 dark:border-primary/50"
          ]
        )}>
          <Icon className={cn(
            "h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6",
            "text-gray-600 dark:text-gray-400",
            isSelected && "text-primary dark:text-primary"
          )} />
        </div>
        <h3 className={cn(
          "text-base sm:text-lg lg:text-lg",
          "font-medium sm:font-semibold",
          "text-gray-900 dark:text-white",
          "line-clamp-2",
          isSelected && "text-primary dark:text-primary"
        )}>
          {template.name}
        </h3>
      </div>
      <p className={cn(
        "text-xs sm:text-sm lg:text-sm",
        "text-gray-600 dark:text-gray-400",
        "leading-relaxed",
        "line-clamp-3"
      )}>
        {template.description}
      </p>
    </button>
  )
}

interface TemplateDialogProps {
  trigger?: React.ReactNode
}

export function TemplateDialog({ trigger }: TemplateDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedTemplate, setSelectedTemplate] = React.useState<FormTemplateId | null>(null)
  const [isCreating, setIsCreating] = React.useState(false)
  
  const router = useRouter()

  const handleCreateForm = async () => {
    if (!selectedTemplate) return

    try {
      setIsCreating(true)
      const response = await client.forms.createFromTemplate.$post({
        templateId: selectedTemplate,
      })
      
      const result = await response.json()
      
      toast.success("Form created", {
        description: `Successfully created ${formTemplates[selectedTemplate].name}`,
      })
      
      router.push(`/dashboard/forms/${result.id}`)
      setOpen(false)
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create form. Please try again.",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className={cn(
            "text-sm sm:text-base",
            "px-4 py-2 sm:px-5 sm:py-2.5",
            "bg-white dark:bg-zinc-900",
            "border border-gray-200 dark:border-zinc-800",
            "text-gray-900 dark:text-white",
            "hover:bg-gray-50 dark:hover:bg-zinc-800",
            "shadow-sm"
          )}>
            Create Form
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[400px] sm:max-w-[600px] lg:max-w-[900px]">
        <div className="flex flex-col gap-4 sm:gap-6 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-zinc-100 to-white dark:from-zinc-900 dark:to-zinc-800 border-b border-gray-200 dark:border-zinc-800">
            <DialogTitle className={cn(
              "text-xl sm:text-2xl lg:text-2xl",
              "font-bold tracking-tight",
              "text-gray-900 dark:text-white"
            )}>
              Choose a template
            </DialogTitle>
            <DialogDescription className={cn(
              "mt-2",
              "text-xs sm:text-sm lg:text-base",
              "text-gray-600 dark:text-gray-400"
            )}>
              Select a template to quickly create a new form
            </DialogDescription>
          </div>

          <div className="px-4 sm:px-5 lg:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {Object.entries(formTemplates).map(([id, template]) => (
                <TemplateCard
                  key={id}
                  template={template}
                  isSelected={selectedTemplate === id}
                  onClick={() => setSelectedTemplate(id as FormTemplateId)}
                />
              ))}
            </div>
          </div>

          <div className={cn(
            "flex justify-end gap-2 sm:gap-3",
            "p-4 sm:p-5 lg:p-6",
            "bg-gradient-to-r from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-800/50",
            "border-t border-gray-200 dark:border-zinc-800"
          )}>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className={cn(
                "text-sm sm:text-base",
                "px-4 py-2 sm:px-5 sm:py-2.5",
                "bg-white dark:bg-zinc-900",
                "border border-gray-200 dark:border-zinc-800",
                "text-gray-700 dark:text-gray-300",
                "hover:bg-gray-50 dark:hover:bg-zinc-800"
              )}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateForm}
              disabled={!selectedTemplate || isCreating}
              className={cn(
                "text-sm sm:text-base lg:text-lg",
                "px-4 py-2 sm:px-6 sm:py-2.5 lg:px-8 lg:py-3",
                "bg-gray-900 dark:bg-white",
                "text-white dark:text-gray-900",
                "hover:bg-gray-800 dark:hover:bg-gray-100",
                "shadow-sm"
              )}
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                "Create Form"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 