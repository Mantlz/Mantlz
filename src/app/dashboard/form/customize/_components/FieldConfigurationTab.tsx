'use client'

import React, { useState, useEffect } from 'react';
import { FormFieldItem } from './FormFieldItem';
import { FormField, ProductDisplayMode } from '../types';
import { PlusCircleIcon, CheckCircleIcon, LayersIcon, ArrowDownIcon, GripHorizontal, InfoIcon, CrownIcon, LoaderCircle } from 'lucide-react';
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
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { useSubscription } from '@/hooks/useSubscription';
import ProductField from './product-field';
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { Decimal } from '@prisma/client/runtime/library';

interface FieldConfigurationTabProps {
  formFields: FormField[];
  availableFields: FormField[];
  formType: string;
  onUpdateField: (id: string, property: string, value: string | boolean | number | string[]) => void;
  onToggleField: (field: FormField) => void;
  onToggleRequired: (id: string, required: boolean) => void;
  onReorderFields?: (startIndex: number, endIndex: number) => void;
}

// Add type for product data
interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  price: Decimal;
  currency: string;
  image: string | null;
  active: boolean;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
  stripeConnectionId: string;
  stripeProductId: string;
  stripePriceId: string;
}

export function FieldConfigurationTab({ 
  formFields, 
  availableFields, 
  formType, 
  onUpdateField, 
  onToggleField, 
  onToggleRequired,
  onReorderFields
}: FieldConfigurationTabProps) {
  const { isPremium } = useSubscription();
  const [isClient, setIsClient] = useState(false);
  
  // Fetch Stripe products if user is on PRO plan
  const { data: stripeProducts, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["stripeProducts"],
    queryFn: async () => {
      console.log('Fetching Stripe products...');
      try {
        const response = await client.stripe.getProducts.$get();
        const data = await response.json();
        console.log('Stripe products response:', data);
        return data;
      } catch (error) {
        console.error('Error fetching Stripe products:', error);
        throw error;
      }
    },
    enabled: isPremium && formType === 'order',
  });

  // Add debug logs for subscription and form type
  useEffect(() => {
    console.log('Current state:', {
      isPremium,
      formType,
      isLoadingProducts,
      stripeProducts,
    });
  }, [isPremium, formType, isLoadingProducts, stripeProducts]);

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
      
      if (activeIndex !== -1 && overIndex !== -1 && onReorderFields) {
        onReorderFields(activeIndex, overIndex);
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
          {formFields.map((field) => (
            <div key={field.id} className="bg-white dark:bg-zinc-950 rounded-lg border border-neutral-200 dark:border-zinc-800 p-3">
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
                onToggleRequired={onToggleRequired}
                onRemove={onToggleField}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    );
  };

  // Filter available fields - show all fields but mark premium ones
  const filteredAvailableFields = availableFields.filter(field => {
    return !formFields.some(f => f.id === field.id);
  });

  // Render Stripe products in Pro Fields section
  const renderStripeProducts = () => {
    console.log('Rendering Stripe products section:', {
      isPremium,
      formType,
      isLoadingProducts,
      hasProducts: Boolean(stripeProducts?.products?.length),
      products: stripeProducts?.products,
    });

    if (!isPremium || formType !== 'order') {
      console.log('Not showing products because:', {
        isPremium,
        formType,
        shouldShow: isPremium && formType === 'order'
      });
      return null;
    }

    if (isLoadingProducts) {
      console.log('Loading products...');
      return (
        <div className="flex items-center justify-center p-4">
          <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
          <span className="ml-2 text-sm text-neutral-500">Loading products...</span>
        </div>
      );
    }

    if (!stripeProducts?.products?.length) {
      console.log('No products found');
      return (
        <div className="p-4 text-center text-sm text-neutral-500">
          <p>No products found in your Stripe account.</p>
          <p className="mt-1">Add products in Stripe to display them here.</p>
        </div>
      );
    }

    console.log('Rendering products list:', stripeProducts.products);
    return (
      <div className="space-y-2">
        {stripeProducts.products.map((product: StripeProduct) => {
          console.log('Rendering product:', product);
          return (
            <div 
              key={product.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                formFields.some(f => f.id === `product_${product.id}`)
                  ? 'bg-zinc-100/80 text-neutral-400 dark:bg-zinc-800/60 dark:text-neutral-500 border border-neutral-200 dark:border-zinc-800 opacity-60 cursor-not-allowed' 
                  : 'bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 hover:border-primary/20 dark:hover:border-primary/20 hover:shadow-sm cursor-pointer'
              )}
              onClick={() => {
                console.log('Product clicked:', product);
                if (!formFields.some(f => f.id === `product_${product.id}`)) {
                  const newField: FormField = {
                    id: `product_${product.id}`,
                    name: `product_${product.id}`,
                    label: product.name,
                    type: 'product',
                    required: true,
                    displayMode: 'grid' as ProductDisplayMode,
                    productIds: [product.id],
                    products: [{
                      id: product.id,
                      name: product.name,
                      description: product.description || undefined,
                      price: Number(product.price),
                      currency: product.currency,
                      image: product.image || undefined
                    }],
                    premium: true
                  };
                  console.log('Adding new field:', newField);
                  onToggleField(newField);
                }
              }}
            >
              {product.image && (
                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                    {product.name}
                  </span>
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: product.currency
                    }).format(Number(product.price))}
                  </span>
                </div>
                {product.description && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">
                    {product.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="bg-zinc-50/50 dark:bg-zinc-950/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
        <div className="flex gap-2 text-sm text-blue-600 dark:text-blue-400">
          <InfoIcon className="h-4 w-4 mt-0.5 shrink-0 text-blue-500 dark:text-blue-400" />
          <div>
            <p>{getGuideText()}</p>
            <p className="text-xs text-blue-500/70 dark:text-blue-400/70 mt-1">
              Drag and drop fields to reorder them
            </p>
          </div>
        </div>
      </div>
      
      {/* Current Fields Section */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-neutral-800 dark:text-neutral-200">
          <span className="flex items-center gap-2">
            <LayersIcon className="h-4 w-4 text-primary/70" />
            Form Elements
          </span>
        </h3>
        {formFields.length === 0 ? (
          <div className="text-center py-6 px-4 bg-zinc-50/80 dark:bg-zinc-800/30 rounded-lg border border-dashed border-neutral-200 dark:border-zinc-800 transition-all duration-300">
            <GripHorizontal className="h-8 w-8 mx-auto text-neutral-300 dark:text-neutral-600 mb-2" />
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">No fields added yet</p>
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
        <h3 className="text-sm font-medium mb-3 text-neutral-800 dark:text-neutral-200">
          <span className="flex items-center gap-2">
            <PlusCircleIcon className="h-4 w-4 text-primary/70" />
            Available Fields
          </span>
        </h3>
        {filteredAvailableFields.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 p-3 bg-zinc-50/80 dark:bg-zinc-800/30 rounded-lg border border-neutral-200 dark:border-zinc-800">
            No additional fields available for this form type.
          </p>
        ) : (
          <div className="space-y-4">
            {/* Standard Fields */}
            <div>
              <h4 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2 px-1">
                Standard Fields
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredAvailableFields
                  .filter(field => !field.premium)
                  .map(field => (
                    <div 
                      key={field.id} 
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200",
                        formFields.some(f => f.id === field.id)
                          ? 'bg-zinc-100/80 text-neutral-400 dark:bg-zinc-800/60 dark:text-neutral-500 border border-neutral-200 dark:border-zinc-800 opacity-60 cursor-not-allowed' 
                          : 'bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 hover:border-primary/20 dark:hover:border-primary/20 hover:shadow-sm cursor-pointer'
                      )}
                      onClick={() => !formFields.some(f => f.id === field.id) && onToggleField(field)}
                      role="button"
                      aria-disabled={formFields.some(f => f.id === field.id)}
                      tabIndex={formFields.some(f => f.id === field.id) ? -1 : 0}
                    >
                      {formFields.some(f => f.id === field.id) ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-500 dark:text-green-400 shrink-0" />
                      ) : (
                        <PlusCircleIcon className="h-4 w-4 text-primary shrink-0" />
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                          {field.label}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {getFieldTypeLabel(field.type)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Pro Fields */}
            <div>
              <h4 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2 px-1 flex items-center gap-2">
                Pro Fields
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                  <CrownIcon className="h-3 w-3" />
                  Pro
                </span>
              </h4>
              {/* Render Stripe Products */}
              {formType === 'order' && renderStripeProducts()}
              {/* Regular Pro Fields */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredAvailableFields
                  .filter(field => field.premium)
                  .map(field => (
                    <div 
                      key={field.id} 
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200",
                        formFields.some(f => f.id === field.id)
                          ? 'bg-zinc-100/80 text-neutral-400 dark:bg-zinc-800/60 dark:text-neutral-500 border border-neutral-200 dark:border-zinc-800 opacity-60 cursor-not-allowed' 
                          : !isPremium
                            ? 'bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 opacity-70 cursor-not-allowed'
                            : 'bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 hover:border-primary/20 dark:hover:border-primary/20 hover:shadow-sm cursor-pointer'
                      )}
                      onClick={() => !formFields.some(f => f.id === field.id) && isPremium && onToggleField(field)}
                      role="button"
                      aria-disabled={formFields.some(f => f.id === field.id) || !isPremium}
                      tabIndex={formFields.some(f => f.id === field.id) || !isPremium ? -1 : 0}
                    >
                      {formFields.some(f => f.id === field.id) ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-500 dark:text-green-400 shrink-0" />
                      ) : (
                        <PlusCircleIcon className="h-4 w-4 text-primary shrink-0" />
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                          {field.label}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {getFieldTypeLabel(field.type)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
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
      return 'Paragraph';
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