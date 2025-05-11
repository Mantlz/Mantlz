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
import { FileUpload } from '@/components/ui/file-upload';

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
  index,
  arrLength,
  onUpdate,
  onMove,
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
      className="flex items-start gap-4 p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="w-5 h-5 text-zinc-400" />
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Field Label</Label>
          <div className="flex items-center gap-2">
            <Label htmlFor={`required-${field.id}`} className="text-sm text-zinc-500">
              Required
            </Label>
            <Switch
              id={`required-${field.id}`}
              checked={field.required}
              onCheckedChange={(checked) => onToggleRequired(field.id, checked)}
            />
          </div>
        </div>

        <Input
          value={field.label}
          onChange={(e) => onUpdate(field.id, 'label', e.target.value)}
          placeholder="Enter field label"
        />

        {field.type === 'file' && (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Accepted File Types</Label>
              <Input
                value={field.accept || ''}
                onChange={(e) => onUpdate(field.id, 'accept', e.target.value)}
                placeholder=".pdf,.doc,.docx,.jpg,.png"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Max File Size (MB)</Label>
              <Input
                type="number"
                value={field.maxSize ? field.maxSize / (1024 * 1024) : 10}
                onChange={(e) => onUpdate(field.id, 'maxSize', Number(e.target.value) * 1024 * 1024)}
                min={1}
                max={100}
              />
            </div>
          </>
        )}

        {field.type === 'select' && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Options (one per line)</Label>
            <textarea
              value={field.options?.join('\n') || ''}
              onChange={(e) => onUpdate(field.id, 'options', e.target.value.split('\n'))}
              className="w-full h-24 p-2 border rounded-md"
              placeholder="Option 1&#10;Option 2&#10;Option 3"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMove(field.id, 'up')}
            disabled={index === 0}
          >
            Move Up
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMove(field.id, 'down')}
            disabled={index === arrLength - 1}
          >
            Move Down
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(field)}
            className="ml-auto"
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 