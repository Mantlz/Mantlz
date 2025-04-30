'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FormField } from '../types';
import { XIcon, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FormFieldItemProps {
  field: FormField;
  index: number;
  arrLength: number;
  onUpdate: (id: string, property: string, value: string | number | boolean) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onToggleRequired: (id: string, required: boolean) => void;
  onRemove: (field: FormField) => void;
}

export function FormFieldItem({ 
  field, 


  onUpdate, 

  onToggleRequired, 
  onRemove 
}: FormFieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.9 : 1,
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "bg-white dark:bg-zinc-950 rounded-lg transition-all duration-200",
        "border border-neutral-200 dark:border-zinc-800",
        "hover:border-primary/25 dark:hover:border-primary/25",
        "group",
        isDragging ? "shadow-md ring-1 ring-primary/30 scale-[1.01]" : "hover:shadow-sm"
      )}
    >
      <div className="p-3 flex flex-col gap-3">
        {/* Header row with drag handle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div 
                className={cn(
                  "text-neutral-400 dark:text-neutral-500 cursor-move touch-none",
                  "hover:text-primary/80 dark:hover:text-primary/80",
                  "transition-colors duration-200",
                  "p-1 rounded-lg",
                  "group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900",
                  !isDragging && "group-hover:animate-pulse"
                )}
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-4 w-4" />
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "text-sm font-medium",
                "text-neutral-800 dark:text-neutral-200",
                "transition-colors duration-200"
              )}>
                {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
              </span>
            </div>
          </div>
          
          <Button 
            size="sm" 
            variant="ghost"
            className={cn(
              "h-7 w-7 p-0 rounded-lg cursor-pointer",
              "text-neutral-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-500",
              "opacity-60 hover:opacity-100",
              "transition-all duration-200",
              "hover:bg-red-50 dark:hover:bg-red-900/20"
            )}
            onClick={() => onRemove(field)}
            aria-label="Remove field"
          >
            <XIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
        
        {/* Label input */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input 
              id={`field-${field.id}-label`}
              value={field.label}
              onChange={(e) => onUpdate(field.id, 'label', e.target.value)}
              className={cn(
                "h-9 py-1.5 px-3 text-sm cursor-text",
                "bg-transparent text-neutral-800 dark:text-neutral-200",
                "rounded-lg",
                "border border-neutral-200 dark:border-zinc-800",
                "focus:border-primary/30 focus:ring-1 focus:ring-primary/20",
                "placeholder:text-neutral-400 dark:placeholder:text-neutral-600",
                "transition-all duration-200"
              )}
              placeholder="Field label"
            />
          </div>
          
          <div className="flex items-center gap-1.5 min-w-[85px]">
            <Switch
              id={`required-switch-${field.id}`}
              checked={field.required}
              onCheckedChange={(checked) => onToggleRequired(field.id, checked)}
              className={cn(
                "data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-zinc-200 border border-zinc-200 dark:border-zinc-800",
                "cursor-pointer h-4 w-7"
              )}
            />
            <Label 
              htmlFor={`required-switch-${field.id}`} 
              className="text-xs text-neutral-500 dark:text-neutral-400 cursor-pointer whitespace-nowrap"
            >
              Required
            </Label>
          </div>
        </div>
        
        {/* Placeholder input - simplified */}
        <Input 
          id={`field-${field.id}-placeholder`}
          value={field.placeholder || ''}
          onChange={(e) => onUpdate(field.id, 'placeholder', e.target.value)}
          className={cn(
            "h-9 py-1.5 px-3 text-sm cursor-text",
            "bg-transparent text-neutral-800 dark:text-neutral-200",
            "rounded-lg",
            "border border-neutral-200 dark:border-zinc-800",
            "focus:border-primary/30 focus:ring-1 focus:ring-primary/20",
            "placeholder:text-neutral-400 dark:placeholder:text-neutral-600",
            "transition-all duration-200"
          )}
          placeholder="Placeholder text"
        />
      </div>
    </div>
  );
} 