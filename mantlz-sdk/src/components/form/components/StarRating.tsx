import React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { StarFilledIcon, StarIcon } from '@radix-ui/react-icons';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

export const StarRating = ({ rating, setRating }: StarRatingProps) => {
  return (
    <RadioGroup.Root
      value={rating.toString()}
      onValueChange={(value) => setRating(parseInt(value))}
      style={{
        display: 'flex',
        gap: '8px'
      }}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <RadioGroup.Item
          key={value}
          value={value.toString()}
          style={{
            all: 'unset',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--gray-3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {value <= rating ? (
            <StarFilledIcon style={{ color: 'var(--yellow-9)', width: '20px', height: '20px' }} />
          ) : (
            <StarIcon style={{ color: 'var(--gray-8)', width: '20px', height: '20px' }} />
          )}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}; 