import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconStar } from "@tabler/icons-react"
import { FormTemplate } from "@/types/form-builder"

interface FormTemplateCardProps {
  template: FormTemplate
  isSelected: boolean
  onSelect: () => void
  onContinue: () => void
}

export function FormTemplateCard({ template, isSelected, onSelect, onContinue }: FormTemplateCardProps) {
  const Icon = template.icon
  const isComingSoon = !!template.comingSoon
  const isPopular = !!template.popular

  return (
    <div 
      onClick={() => !isComingSoon && onSelect()}
      className={cn(
        "relative rounded-lg overflow-hidden transition-all duration-200",
        !isComingSoon && "cursor-pointer hover:shadow-sm hover:translate-y-[-2px]",
        isComingSoon && "opacity-75"
      )}
    >
      <Card 
        className={cn(
          "h-full border transition-all duration-200",
          isSelected && !isComingSoon
            ? 'border-primary/30 dark:border-primary/40' 
            : '',
          isComingSoon 
            ? 'border-dashed border-neutral-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50'
            : 'border-neutral-200 dark:border-zinc-800 hover:border-neutral-300 dark:hover:border-zinc-700',
          "bg-white dark:bg-zinc-900 overflow-hidden"
        )}
      >
        {isSelected && !isComingSoon && (
          <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" />
        )}
        
        <CardHeader className="p-3 pb-0">
          <div className="flex items-start justify-between mb-2">
            <div className={cn(
              "p-1.5 rounded-lg shrink-0",
              isSelected && !isComingSoon
                ? 'bg-primary/10 text-primary' 
                : isComingSoon
                  ? 'bg-zinc-100 text-neutral-400 dark:bg-zinc-800 dark:text-neutral-500'
                  : 'bg-zinc-100 text-neutral-500 dark:bg-zinc-800 dark:text-neutral-400'
            )}>
              <Icon className="h-4 w-4" />
            </div>
            
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
          
          <div>
            <CardTitle className={cn(
              "text-sm font-medium mb-0.5",
              isSelected && !isComingSoon 
                ? 'text-primary' 
                : isComingSoon
                  ? 'text-neutral-600 dark:text-neutral-400'
                  : 'text-neutral-800 dark:text-white'
            )}>
              {template.name}
            </CardTitle>
            <CardDescription className={cn(
              "text-xs line-clamp-1",
              isComingSoon 
                ? "text-neutral-400 dark:text-neutral-500"
                : "text-neutral-500 dark:text-neutral-400"
            )}>
              {template.description}
            </CardDescription>
          </div>
        </CardHeader>
        
        {!isComingSoon && (
          <CardContent className="p-3 pt-0">
            <Button 
              variant={isSelected ? "default" : "outline"} 
              size="sm" 
              className={cn(
                "mt-2 w-full text-xs rounded-lg h-8 cursor-pointer",
                !isSelected && "text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
              onClick={(e) => {
                e.stopPropagation();
                if (isSelected) {
                  onContinue();
                } else {
                  onSelect();
                }
              }}
            >
              {isSelected ? "Use Template" : "Select"}
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  )
} 