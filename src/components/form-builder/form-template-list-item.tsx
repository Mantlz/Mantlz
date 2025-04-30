import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconStar } from "@tabler/icons-react"
import { FormTemplate } from "@/types/form-builder"

interface FormTemplateListItemProps {
  template: FormTemplate
  isSelected: boolean
  onSelect: () => void
  onContinue: () => void
}

export function FormTemplateListItem({ template, isSelected, onSelect, onContinue }: FormTemplateListItemProps) {
  const Icon = template.icon
  const isComingSoon = !!template.comingSoon
  const isPopular = !!template.popular

  return (
    <div 
      key={template.id}
      onClick={() => !isComingSoon && onSelect()}
      className={cn(
        "relative",
        !isComingSoon && "cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors duration-200",
        isComingSoon && "opacity-75",
        isSelected && !isComingSoon && "bg-primary/5 dark:bg-primary/10"
      )}
    >
      <div className="flex flex-row items-center px-4 py-3">
        <div className="flex items-center flex-1 gap-3">
          <div className={cn(
            "p-2 rounded-lg shrink-0",
            isSelected && !isComingSoon
              ? 'bg-primary/10 text-primary' 
              : isComingSoon
                ? 'bg-zinc-100 text-neutral-400 dark:bg-zinc-800 dark:text-neutral-500'
                : 'bg-zinc-100 text-neutral-500 dark:bg-zinc-800 dark:text-neutral-400'
          )}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className={cn(
                "text-sm font-medium truncate",
                isSelected && !isComingSoon 
                  ? 'text-primary' 
                  : isComingSoon
                    ? 'text-neutral-600 dark:text-neutral-400'
                    : 'text-neutral-800 dark:text-white'
              )}>
                {template.name}
              </h3>
              
              {isPopular && !isComingSoon && (
                <Badge 
                  className="bg-amber-50 hover:bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 flex items-center gap-0.5 text-[10px] font-medium py-0 h-4 px-1.5"
                >
                  <IconStar className="h-2.5 w-2.5" />
                  Popular
                </Badge>
              )}
              
              {isComingSoon && (
                <Badge 
                  variant="outline" 
                  className="text-[10px] border-neutral-200 dark:border-zinc-800 text-neutral-500 dark:text-neutral-400 bg-zinc-50 dark:bg-zinc-900 font-medium px-1.5 h-4"
                >
                  Coming Soon
                </Badge>
              )}
            </div>
            <p className={cn(
              "text-xs line-clamp-1",
              isComingSoon 
                ? "text-neutral-400 dark:text-neutral-500"
                : "text-neutral-500 dark:text-neutral-400"
            )}>
              {template.description}
            </p>
          </div>
        </div>
        {!isComingSoon && (
          <div className="ml-auto">
            <Button 
              variant={isSelected ? "default" : "outline"} 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                if (isSelected) {
                  onContinue();
                } else {
                  onSelect();
                }
              }}
              className={cn(
                "text-xs h-8 px-3 rounded-lg cursor-pointer",
                !isSelected && "text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              {isSelected ? "Use Template" : "Select"}
            </Button>
          </div>
        )}
      </div>
      {isSelected && !isComingSoon && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
      )}
    </div>
  )
} 