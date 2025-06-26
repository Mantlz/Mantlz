'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FormField } from '../types';
import { XIcon, GripVertical } from 'lucide-react';
// import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// import { FileUpload } from '@/components/ui/file-upload';

interface FormFieldItemProps {
  field: FormField;
  index: number;
  arrLength: number;
  onUpdate: (id: string, property: string, value: string | number | boolean | string[]) => void;
  onToggleRequired: (id: string, required: boolean) => void;
  onRemove: (field: FormField) => void;
}

export function FormFieldItem({
  field,
  onUpdate,
  onToggleRequired,
  onRemove,
}: FormFieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-start gap-4 p-4 bg-white dark:bg-background rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-primary/20 dark:hover:border-primary/20 transition-all duration-200"
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab hover:text-primary transition-colors duration-200 pt-1"
      >
        <GripVertical className="w-5 h-5 text-zinc-400 group-hover:text-primary" />
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Field Label</Label>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">The label that appears above this field</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor={`required-${field.id}`} className="text-sm text-neutral-600 dark:text-neutral-400">
                Required
              </Label>
              <Switch
                id={`required-${field.id}`}
                checked={field.required}
                onCheckedChange={(checked) => onToggleRequired(field.id, checked)}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(field)}
              className="text-neutral-500 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400 transition-colors duration-200 h-8 w-8 p-0"
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Input
          value={field.label}
          onChange={(e) => onUpdate(field.id, 'label', e.target.value)}
          placeholder="Enter field label"
          className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 focus:border-primary/50 focus:ring-primary/20"
        />

        {field.type === 'select' && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Options (one per line)</Label>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Enter each option on a new line</p>
            <textarea
              value={field.options?.join('\n') || ''}
              onChange={(e) => onUpdate(field.id, 'options', e.target.value.split('\n'))}
              className="w-full h-24 p-2 border rounded-md bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 focus:border-primary/50 focus:ring-primary/20"
              placeholder="Option 1&#10;Option 2&#10;Option 3"
            />
          </div>
        )}
      </div>
    </div>
  );
} 