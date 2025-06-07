import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconStar, IconLock } from "@tabler/icons-react"
import { FormTemplate } from "@/types/form-builder"
import { useSubscription } from "@/hooks/useSubscription"

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
        "relative rounded-lg overflow-hidden transition-all duration-200",
        !isComingSoon && !isLocked && "cursor-pointer hover:shadow-sm hover:translate-y-[-2px]",
        (isComingSoon || isLocked) && "opacity-75"
      )}
    >
      <Card 
        className={cn(
          "h-full border transition-all duration-200",
          isSelected && !isComingSoon && !isLocked
            ? 'border-primary/30 dark:border-primary/40' 
            : '',
          isComingSoon || isLocked
            ? 'border-dashed border-neutral-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50'
            : 'border-neutral-200 dark:border-zinc-800 hover:border-neutral-300 dark:hover:border-zinc-700',
          "bg-white dark:bg-zinc-900 overflow-hidden"
        )}
      >
        {isSelected && !isComingSoon && !isLocked && (
          <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" />
        )}
        
        <CardHeader className="p-3 pb-0">
          <div className="flex items-start justify-between mb-2">
            <div className={cn(
              "p-1.5 rounded-lg shrink-0",
              isSelected && !isComingSoon && !isLocked
                ? 'bg-primary/10 text-primary' 
                : isComingSoon || isLocked
                  ? 'bg-zinc-100 text-neutral-400 dark:bg-zinc-800 dark:text-neutral-500'
                  : 'bg-zinc-100 text-neutral-500 dark:bg-zinc-800 dark:text-neutral-400'
            )}>
              <Icon className="h-4 w-4" />
            </div>
            
            <div className="flex gap-1">
              {isPopular && !isComingSoon && (
                <Badge 
                  className="bg-amber-50 hover:bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 flex items-center gap-0.5 text-[10px] font-medium py-0 h-4 px-1.5"
                >
                  <IconStar className="h-2.5 w-2.5" />
                  Popular
                </Badge>
              )}
              
              {isLocked && (
                <Badge 
                  className={cn(
                    "flex items-center gap-0.5 text-[10px] font-medium py-0 h-4 px-1.5",
                    isProPlan 
                      ? "bg-orange-50 hover:bg-orange-50 text-orange-600 dark:bg-orange-400/10 dark:text-orange-400"
                      : "bg-blue-50 hover:bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400"
                  )}
                >
                  <IconLock className="h-2.5 w-2.5" />
                  {isProPlan ? 'Pro' : 'Standard'}
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
          </div>
          
          <div>
            <CardTitle className={cn(
              "text-sm font-medium mb-0.5",
              isSelected && !isComingSoon && !isLocked
                ? 'text-primary' 
                : isComingSoon || isLocked
                  ? 'text-neutral-600 dark:text-neutral-400'
                  : 'text-neutral-800 dark:text-white'
            )}>
              {template.name}
            </CardTitle>
            <CardDescription className={cn(
              "text-xs line-clamp-1",
              isComingSoon || isLocked
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
              variant={isSelected && !isLocked ? "default" : "outline"} 
              size="sm" 
              className={cn(
                "mt-2 w-full text-xs rounded-lg h-8 cursor-pointer",
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
          </CardContent>
        )}
      </Card>
    </div>
  )
} 