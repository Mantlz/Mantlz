import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconStar, IconLock } from "@tabler/icons-react"
import { FormTemplate } from "@/types/form-builder"
import { useSubscription } from "@/hooks/useSubscription"

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
  const { userPlan } = useSubscription()
  
  // Check if user has required subscription for this template
  const requiredPlan = template.requiredPlan || 'FREE'
  const planLevel = { 'FREE': 0, 'STANDARD': 1, 'PRO': 2 }
  const userPlanLevel = planLevel[userPlan as keyof typeof planLevel]
  const requiredPlanLevel = planLevel[requiredPlan]
  
  // const isStandardPlan = requiredPlan === 'STANDARD'
  const isProPlan = requiredPlan === 'PRO'
  const hasAccess = userPlanLevel >= requiredPlanLevel
  const isLocked = !hasAccess && requiredPlan !== 'FREE'

  return (
    <div 
      onClick={() => !isComingSoon && !isLocked && onSelect()}
      className={cn(
        "relative rounded-lg overflow-hidden transition-all duration-150 px-4 py-3",
        !isComingSoon && !isLocked && "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800",
        isSelected && !isComingSoon && !isLocked && "bg-primary/5 dark:bg-primary/10",
        (isComingSoon || isLocked) && "opacity-75"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "p-2 rounded-lg shrink-0 h-10 w-10 flex items-center justify-center",
          isSelected && !isComingSoon && !isLocked
            ? 'bg-primary/10 text-primary' 
            : isComingSoon || isLocked
              ? 'bg-zinc-100 text-neutral-400 dark:bg-zinc-800 dark:text-neutral-500'
              : 'bg-zinc-100 text-neutral-500 dark:bg-zinc-800 dark:text-neutral-400'
        )}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "text-base font-medium",
              isSelected && !isComingSoon && !isLocked
                ? 'text-primary' 
                : isComingSoon || isLocked
                  ? 'text-neutral-600 dark:text-neutral-400'
                  : 'text-neutral-800 dark:text-white'
            )}>
              {template.name}
            </h3>
            
            <div className="flex gap-1.5">
              {isPopular && !isComingSoon && (
                <Badge 
                  className="bg-amber-50 hover:bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 flex items-center gap-1 text-xs font-medium py-0.5 h-5 px-2"
                >
                  <IconStar className="h-3 w-3" />
                  Popular
                </Badge>
              )}
              
              {isLocked && (
                <Badge 
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium py-0.5 h-5 px-2",
                    isProPlan 
                      ? "bg-purple-50 hover:bg-purple-50 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400"
                      : "bg-blue-50 hover:bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400"
                  )}
                >
                  <IconLock className="h-3 w-3" />
                  {isProPlan ? 'Pro' : 'Standard'}
                </Badge>
              )}
              
              {isComingSoon && (
                <Badge 
                  variant="outline" 
                  className="text-xs border-neutral-200 dark:border-zinc-800 text-neutral-500 dark:text-neutral-400 bg-zinc-50 dark:bg-zinc-900 font-medium px-2 h-5"
                >
                  Coming Soon
                </Badge>
              )}
            </div>
          </div>
          
          <p className={cn(
            "text-sm line-clamp-1",
            isComingSoon || isLocked
              ? "text-neutral-400 dark:text-neutral-500"
              : "text-neutral-500 dark:text-neutral-400"
          )}>
            {template.description}
          </p>
        </div>
        
        <div className="ml-auto">
          <Button 
            variant={isSelected && !isLocked ? "default" : "outline"} 
            size="sm" 
            className={cn(
              "text-xs h-8 rounded-lg",
              isLocked 
                ? "text-neutral-500 dark:text-neutral-500 border-neutral-200 dark:border-zinc-800 bg-transparent hover:bg-neutral-100 dark:hover:bg-zinc-800"
                : !isSelected && "text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
            onClick={(e) => {
              e.stopPropagation();
              if (isLocked) {
                // Could redirect to pricing page or show upgrade modal here
                window.location.href = '/pricing';
              } else if (isSelected) {
                onContinue();
              } else {
                onSelect();
              }
            }}
          >
            {isLocked 
              ? `Upgrade to ${isProPlan ? 'Pro' : 'Standard'}`
              : isSelected ? "Use Template" : "Select"
            }
          </Button>
        </div>
      </div>
    </div>
  )
} 