'use client'

import React, { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

interface PreviewStarRatingProps {
  label: string;
  required: boolean;
}

export function PreviewStarRating({ label, required }: PreviewStarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const selectedRating = 0; // Preview doesn't have a selection

  return (
    <div className="space-y-2">
      <Label className="block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((ratingValue) => {
          const effectiveRating = Math.max(hoveredRating ?? 0, selectedRating);
          const isFilled = ratingValue <= effectiveRating;
          return (
            <Star
              key={ratingValue}
              className={cn(
                "h-8 w-8 cursor-pointer transition-colors",
                isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-zinc-500"
              )}
              onMouseEnter={() => setHoveredRating(ratingValue)}
              onMouseLeave={() => setHoveredRating(null)}
            />
          );
        })}
      </div>
    </div>
  );
} 