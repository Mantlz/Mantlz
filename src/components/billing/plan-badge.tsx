import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Plan } from '@prisma/client';

interface PlanBadgeProps {
  plan: string | Plan;
}

export function PlanBadge({ plan }: PlanBadgeProps) {
  switch (plan) {
    case 'PRO':
    case Plan.PRO:
      return (
        <Badge className="ml-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none">
          PRO
        </Badge>
      );
    case 'STANDARD':
    case Plan.STANDARD:
      return (
        <Badge className="ml-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-none">
          STANDARD
        </Badge>
      );
    case 'FREE':
    case Plan.FREE:
    default:
      return (
        <Badge className="ml-2 bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-none">
          FREE
        </Badge>
      );
  }
} 