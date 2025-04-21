'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FormFieldItem } from './FormFieldItem';
import { FormField } from '../types';
import { PlusCircleIcon, CheckCircleIcon, LayersIcon, ArrowDownIcon, GripHorizontal, InfoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { 
  arrayMove,
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';

interface FieldConfigurationTabProps {
  formFields: FormField[];
  availableFields: FormField[];
  formType: string;
  onUpdateField: (id: string, property: string, value: any) => void;
  onToggleField: (field: FormField) => void;
  onMoveField: (id: string, direction: 'up' | 'down') => void;
  onToggleRequired: (id: string, required: boolean) => void;
  onReorderFields?: (startIndex: number, endIndex: number) => void;
}

export function FieldConfigurationTab({ 
  formFields, 
  availableFields, 
  formType, 
  onUpdateField, 
  onToggleField, 
  onMoveField, 
  onToggleRequired,
  onReorderFields
}: FieldConfigurationTabProps) {
  // Client-side only rendering flag
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Set up the sensors for pointer and keyboard interactions
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end events
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Find the indices of the dragged item and the item it's dropped over
      const activeIndex = formFields.findIndex(field => field.id === active.id);
      const overIndex = formFields.findIndex(field => field.id === over.id);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        // If we have the reorderFields function, use it for more efficient reordering
        if (onReorderFields) {
          onReorderFields(activeIndex, overIndex);
        } else {
          // Fallback to using the moveField function repeatedly
          const direction = activeIndex < overIndex ? 'down' : 'up';
          const steps = Math.abs(activeIndex - overIndex);
          for (let i = 0; i < steps; i++) {
            if (direction === 'down') {
              onMoveField(active.id as string, 'down');
            } else {
              onMoveField(active.id as string, 'up');
            }
          }
        }
      }
    }
  };

  // Get guide text based on form type
  const getGuideText = () => {
    switch(formType) {
      case 'contact':
        return "Build a contact form by adding fields below";
      case 'feedback':
        return "Create a feedback form with your preferred fields";
      case 'waitlist':
        return "Set up your waitlist signup form with these fields";
      default:
        return "Customize your form by adding fields below";
    }
  };

  // Render function for the sortable fields
  const renderSortableFields = () => {
    if (!isClient) {
      // Simple fallback during SSR
      return (
        <div className="space-y-3">
          {formFields.map((field, index) => (
            <div key={field.id} className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 p-3.5">
              <div className="flex items-center justify-between">
                <span>{field.label}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext 
          items={formFields.map(field => field.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {formFields.map((field, index) => (
              <FormFieldItem 
                key={field.id}
                field={field}
                index={index}
                arrLength={formFields.length}
                onUpdate={onUpdateField}
                onMove={onMoveField} 
                onToggleRequired={onToggleRequired}
                onRemove={onToggleField}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-3 rounded-xl border border-blue-100 dark:border-blue-900/50 mb-5">
        <div className="flex gap-2 text-sm text-blue-700 dark:text-blue-300">
          <InfoIcon className="h-4 w-4 mt-0.5 shrink-0 text-blue-500 dark:text-blue-400" />
          <div>
            <p>{getGuideText()}</p>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
              Drag and drop fields to reorder them
            </p>
          </div>
        </div>
      </div>
      
      {/* Current Fields Section */}
      <div>
        <h3 className="text-base font-medium mb-3 text-gray-800 dark:text-gray-200">
          <span className="flex items-center gap-2">
            <LayersIcon className="h-4 w-4 text-primary/70" />
            Form Elements
          </span>
        </h3>
        {formFields.length === 0 ? (
          <div className="text-center py-7 px-5 bg-gray-50/80 dark:bg-zinc-800/30 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800 transition-all duration-300">
            <GripHorizontal className="h-8 w-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No fields added yet</p>
            <div className="mt-2 flex items-center justify-center text-primary">
              <ArrowDownIcon className="h-4 w-4 animate-bounce" />
            </div>
          </div>
        ) : (
          renderSortableFields()
        )}
      </div>
      
      {/* Available Fields Section */}
      <div>
        <h3 className="text-base font-medium mb-3 text-gray-800 dark:text-gray-200">
          <span className="flex items-center gap-2">
            <PlusCircleIcon className="h-4 w-4 text-primary/70" />
            Add Components
          </span>
        </h3>
        {availableFields.length === 0 ? (
           <p className="text-sm text-gray-500 dark:text-gray-400 p-4 bg-gray-50/80 dark:bg-zinc-800/30 rounded-lg border border-gray-200 dark:border-zinc-800">
             No additional fields available for this form type.
           </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
            {availableFields.map(field => {
              const isAdded = formFields.some(f => f.id === field.id)
              return (
                <div 
                  key={field.id} 
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                    isAdded 
                      ? 'bg-gray-100/80 text-gray-400 dark:bg-zinc-800/60 dark:text-gray-500 border border-gray-200 dark:border-zinc-800 opacity-60 cursor-not-allowed' 
                      : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 cursor-pointer hover:border-primary/20 dark:hover:border-primary/20 hover:shadow-sm'
                  )}
                  onClick={() => !isAdded && onToggleField(field)}
                  role="button"
                  aria-disabled={isAdded}
                  tabIndex={isAdded ? -1 : 0}
                >
                  {isAdded ? (
                    <CheckCircleIcon className="h-4 w-4 text-green-500 dark:text-green-400 shrink-0" />
                  ) : (
                    <PlusCircleIcon className="h-4 w-4 text-primary shrink-0" />
                  )}
                  <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                    {field.label}
                    {!isAdded && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                        ({getFieldTypeLabel(field.type)})
                      </span>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get a user-friendly label for field types
function getFieldTypeLabel(type: string): string {
  switch (type) {
    case 'text':
      return 'Text';
    case 'email':
      return 'Email';
    case 'textarea':
      return 'Long Text';
    case 'number':
      return 'Number';
    case 'checkbox':
      return 'Checkbox';
    case 'select':
      return 'Dropdown';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
} 