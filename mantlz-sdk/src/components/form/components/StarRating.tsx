import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  count?: number;
  colorMode?: 'light' | 'dark';
}

export const StarRating = ({ 
  rating, 
  setRating, 
  count = 5,
  colorMode = 'light'
}: StarRatingProps) => {
  const [hover, setHover] = useState(0);
  
  return (
    <div className="flex gap-1">
      {[...Array(count)].map((_, index) => {
        const starValue = index + 1;
        const effectiveRating = Math.max(hover, rating);
        const isHighlighted = starValue <= effectiveRating;
        const fillColor = colorMode === 'dark' ? "fill-yellow-400 stroke-yellow-400" : "fill-yellow-500 stroke-yellow-500";
        const emptyColor = colorMode === 'dark' ? "stroke-gray-400" : "stroke-gray-300";
        
        return (
          <Star
            key={index}
            size={24}
            className={cn(
              "cursor-pointer transition-all",
              isHighlighted ? fillColor : emptyColor
            )}
            onClick={() => setRating(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
          />
        );
      })}
    </div>
  );
}; 