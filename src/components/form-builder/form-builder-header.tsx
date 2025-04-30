import { Button } from "@/components/ui/button"
import { IconArrowLeft, IconChevronRight } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface FormBuilderHeaderProps {
  onBack: () => void
  onContinue: () => void
  canContinue: boolean
}

export function FormBuilderHeader({ onBack, onContinue, canContinue }: FormBuilderHeaderProps) {
  return (
    <div className="sticky top-0 z-10 backdrop-blur-lg">
      <div className="max-w-5xl mx-auto px-5 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-lg h-9 w-9 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 cursor-pointer"
              onClick={onBack}
            >
              <IconArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-medium text-neutral-900 dark:text-white">
              Create New Form
            </h1>
          </div>
          <Button 
            onClick={onContinue}
            disabled={!canContinue}
            className={cn(
              "flex items-center gap-2 font-medium rounded-lg",
              "bg-primary hover:bg-primary/90 text-white dark:text-black dark:bg-primary",
              "disabled:opacity-60 disabled:pointer-events-none transition-all duration-200",
              "text-sm px-5 h-10 cursor-pointer"
            )}
          >
            Continue
            <IconChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
} 