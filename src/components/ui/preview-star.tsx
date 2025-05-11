'use client'

import React, { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils' // Assuming utils path

interface PreviewStarRatingProps {
  label: string;
  required: boolean;
}

export function PreviewStarRating({ label, required }: PreviewStarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  // In preview, we don't have a real selected value, so just use 0
  const selectedRating = 0; 

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((ratingValue) => {
          const effectiveRating = Math.max(hoveredRating ?? 0, selectedRating);
          const isFilled = ratingValue <= effectiveRating;
          return (
            <Star
              key={ratingValue}
              className={cn(
                "h-8 w-8 cursor-pointer transition-colors",
                isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"
              )}
              onMouseEnter={() => setHoveredRating(ratingValue)}
              onMouseLeave={() => setHoveredRating(null)}
              // onClick is disabled in preview
            />
          );
        })}
      </div>
    </div>
  );
} 