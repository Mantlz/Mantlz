'use client'

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { TextIcon, InfoIcon } from 'lucide-react';

interface FormSettingsTabProps {
  formTitle: string;
  formDescription: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function FormSettingsTab({ 
  formTitle, 
  formDescription, 
  onTitleChange, 
  onDescriptionChange 
}: FormSettingsTabProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-medium mb-4 text-neutral-800  dark:text-neutral-200 flex items-center gap-2">
        <TextIcon className="h-4 w-4 text-primary/70" />
        General Settings
      </h3>
      
      <div className="space-y-5 border border-neutral-200 dark:border-zinc-800 rounded-md p-4">
        <div className="relative">
          <Label 
            htmlFor="form-title" 
            className="text-sm font-medium text-neutral-800 dark:text-neutral-300  mb-2 flex items-center gap-1.5"
          >
            Form Title
            <span className="text-red-500 text-xs">*</span>
          </Label>
          <Input 
            id="form-title"
            value={formTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className={cn(
              "bg-white dark:bg-neutral-900",
              "border border-neutral-200 dark:border-neutral-700",
              "rounded-md p-2 cursor-text",
              "text-neutral-900 dark:text-neutral-200",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200"
            )}
            required
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 flex items-center gap-1.5">
            <InfoIcon className="h-3 w-3" />
            This title will be displayed at the top of your form
          </p>
        </div>
        
        <div className="relative">
          <Label 
            htmlFor="form-description" 
            className="text-sm font-medium text-neutral-800 dark:text-neutral-300 block mb-2"
          >
            Form Description <span className="text-neutral-400 dark:text-neutral-500 text-xs font-normal">(Optional)</span>
          </Label>
          <Textarea 
            id="form-description"
            value={formDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={4}
            className={cn(
              "bg-white dark:bg-neutral-900",
              "border border-neutral-200 dark:border-neutral-700",
              "rounded-md p-2 cursor-text",
              "text-neutral-900 dark:text-neutral-200",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200",
              "resize-none"
            )}
            placeholder="Add a short description to provide context for users..."
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 flex items-center gap-1.5">
            <InfoIcon className="h-3 w-3" />
            A brief explanation to help users understand the purpose of your form
          </p>
        </div>
      </div>
    </div>
  );
} 