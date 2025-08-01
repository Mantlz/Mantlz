'use client'

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { PreviewStarRating } from './PreviewStarRating';
import { FormField } from '../types';
import { cn } from '@/lib/utils';
import { useSubscription } from '@/hooks/useSubscription';
import { FileUpload } from '@/components/ui/file-upload';
import { CrownIcon } from 'lucide-react';

interface FormPreviewProps {
  formTitle: string;
  formDescription: string;
  formFields: FormField[];
  formType: string;
}

export function FormPreview({ 
  formTitle, 
  formDescription, 
  formFields,
}: FormPreviewProps) {
  const { isPremium } = useSubscription();

  return (
    <div className="py-6 px-4 rounded-lg border border-neutral-200 dark:border-zinc-700/50 ">
      <div className='pb-4 mb-4 '>
        <h1 className="text-xl font-medium mb-2 text-neutral-900 dark:text-white">{formTitle || 'Form Title'}</h1>
        {formDescription && (
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">{formDescription}</p>
        )}
      </div>
      
      <div className="space-y-4">
        {formFields.length > 0 ? (
          formFields.map((field) => (
            <div key={field.id} className="space-y-2 group">
              <div className="flex justify-between items-center">
                {field.type === 'number' && field.name === 'rating' ? (
                  <PreviewStarRating label={field.label} required={field.required} />
                ) : (
                  <Label className={cn(
                    "block text-sm font-medium",
                    "text-neutral-800 dark:text-neutral-300",
                    field.required && "flex items-center gap-1"
                  )}>
                    <span className="flex items-center gap-2">
                      {field.label} 
                      {field.required && (
                        <span className="text-red-500 font-medium text-xs">*</span>
                      )}
                      {field.premium && !isPremium && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                          <CrownIcon className="h-3 w-3" />
                          Pro
                        </span>
                      )}
                    </span>
                  </Label>
                )}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-xs px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-neutral-500 dark:text-neutral-400 font-mono">
                    {field.type}
                  </div>
                </div>
              </div>

              {field.type === 'text' && (
                <Input
                  className={cn(
                    "w-full p-2 rounded-lg",
                    "bg-zinc-50 dark:bg-zinc-900",
                    "border border-neutral-200 dark:border-zinc-800",
                    "text-neutral-500 dark:text-neutral-400",
                    "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
                    "cursor-not-allowed transition-colors group-hover:border-primary/30",
                    "focus:ring-2 focus:ring-primary/20"
                  )}
                  placeholder={field.placeholder}
                  disabled
                />
              )}

              {field.type === 'email' && (
                <Input
                  type="email"
                  className={cn(
                    "w-full p-2 rounded-lg",
                    "bg-zinc-50 dark:bg-zinc-900",
                    "border border-neutral-200 dark:border-zinc-800",
                    "text-neutral-500 dark:text-neutral-400",
                    "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
                    "cursor-not-allowed transition-colors group-hover:border-primary/30",
                    "focus:ring-2 focus:ring-primary/20"
                  )}
                  placeholder={field.placeholder}
                  disabled
                />
              )}

              {field.type === 'textarea' && (
                <Textarea
                  className={cn(
                    "w-full p-2 rounded-lg",
                    "bg-zinc-50 dark:bg-zinc-900",
                    "border border-neutral-200 dark:border-zinc-800",
                    "text-neutral-500 dark:text-neutral-400",
                    "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
                    "cursor-not-allowed transition-colors group-hover:border-primary/30",
                    "focus:ring-2 focus:ring-primary/20"
                  )}
                  rows={4}
                  placeholder={field.placeholder}
                  disabled
                />
              )}

              {field.type === 'number' && field.name !== 'rating' && (
                <Input
                  type="number"
                  className={cn(
                    "w-full p-2 rounded-lg",
                    "bg-zinc-50 dark:bg-zinc-900",
                    "border border-neutral-200 dark:border-zinc-800",
                    "text-neutral-500 dark:text-neutral-400",
                    "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
                    "cursor-not-allowed transition-colors group-hover:border-primary/30",
                    "focus:ring-2 focus:ring-primary/20"
                  )}
                  placeholder={field.placeholder}
                  disabled
                />
              )}

              {field.type === 'checkbox' && (
                <div className="flex items-center gap-2 opacity-70 py-1">
                  <Checkbox disabled className="rounded-lg border-neutral-400 dark:border-zinc-600 h-4 w-4" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">{field.placeholder || 'Check this option'}</span>
                </div>
              )}

              {field.type === 'file' && (
                <div className={cn(
                  "opacity-70",
                  field.premium && !isPremium && "opacity-70"
                )}>
                  <FileUpload
                    disabled={true}
                    accept={field.accept?.join(',')}
                    maxSize={field.maxSize}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-neutral-500 dark:text-neutral-400 border-2 border-dashed border-neutral-200 dark:border-zinc-700 rounded-lg bg-zinc-50/80 dark:bg-zinc-900/50">
            <div className="flex flex-col items-center justify-center">
              <svg className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="font-medium text-base mb-1">Your form is empty</p>
              <p className="text-xs max-w-xs">Add fields from the sidebar to build your form</p>
            </div>
          </div>
        )}
        
        {formFields.length > 0 && (
          <Button 
            className={cn(
              "w-full mt-6 py-2 rounded-lg cursor-pointer",
              "bg-primary hover:bg-primary/90",
              "text-white dark:text-black dark:bg-primary font-medium text-sm",
              "disabled:opacity-60 disabled:pointer-events-none transition-all duration-200"
            )}
            disabled
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
} 