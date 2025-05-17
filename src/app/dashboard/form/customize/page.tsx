"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { client } from '@/lib/client'
import { FormType } from '@prisma/client'
import { FormField, FieldType } from './types'
import { FieldConfigurationTab } from './_components/FieldConfigurationTab'
import { FormSettingsTab } from './_components/FormSettingsTab'
import { FormPreview } from './_components/FormPreview'
import { defaultFieldsByType, availableFieldsByType, formMetaByType } from './_components/form-config'
import { IconArrowLeft } from "@tabler/icons-react"
import { Save, Grid3X3, SettingsIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function CustomizeFormPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading form builder...</div>}>
      <CustomizeFormContent />
    </Suspense>
  )
}

function CustomizeFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const formType = searchParams.get('type') || 'waitlist'
  
  // Add client-side rendering flag
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const [formTitle, setFormTitle] = useState(formMetaByType[formType as keyof typeof formMetaByType]?.title || 'New Form')
  const [formDescription, setFormDescription] = useState(formMetaByType[formType as keyof typeof formMetaByType]?.description || '')
  const [formFields, setFormFields] = useState<FormField[]>(defaultFieldsByType[formType as keyof typeof defaultFieldsByType] || [])
  const [isCreating, setIsCreating] = useState(false)
  
  const availableFields = availableFieldsByType[formType as keyof typeof availableFieldsByType] || []
  
  useEffect(() => {
    if (formType && !['waitlist', 'contact', 'feedback', 'custom', 'survey', 'application', 'order', 'analytics-opt-in', 'rsvp'].includes(formType)) {
      toast.error('Invalid form type')
      router.push('/dashboard/form')
    }
  }, [formType, router])
  
  const toggleField = (field: FormField) => {
    const fieldIndex = formFields.findIndex(f => f.id === field.id)
    if (fieldIndex >= 0) {
      setFormFields(formFields.filter(f => f.id !== field.id))
    } else {
      setFormFields([...formFields, field])
    }
  }
  
  const updateField = (id: string, property: string, value: string | number | boolean | string[]) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, [property]: value } : field
    ))
  }

  const toggleRequired = (id: string, required: boolean) => {
     setFormFields(formFields.map(field => 
      field.id === id ? { ...field, required } : field
    ))
  }
  
  const createForm = async () => {
    if (formFields.length === 0) {
      toast.error('Please add at least one field to your form')
      return
    }
    setIsCreating(true)
    try {
      const formSchema: Record<string, {
        type: FieldType;
        required: boolean;
        label: string;
        placeholder?: string;
        options?: string[];
      }> = {}
      formFields.forEach(field => {
        formSchema[field.name] = {
          type: field.type,
          required: field.required,
          label: field.label,
          placeholder: field.placeholder,
          options: field.options
        }
      })
      
      // Convert formType string to uppercase enum value
      const formTypeEnum = formType.toUpperCase() as FormType;

      const response = await client.forms.createForm.$post({
        name: formTitle,
        description: formDescription,
        schema: JSON.stringify(formSchema),
        formType: formTypeEnum,
      })
      
      const result = await response.json()
      toast.success('Form created successfully')
      router.push(`/dashboard/form/${result.id}`)
    } catch (error: Error | unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to create form')
      console.error(error)
    } finally {
      setIsCreating(false)
    }
  }
  

  // New function for direct reordering - helpful for drag and drop
  const reorderFields = (startIndex: number, endIndex: number) => {
    if (startIndex < 0 || startIndex >= formFields.length || 
        endIndex < 0 || endIndex >= formFields.length) {
      return; // Invalid indices
    }
    
    const result = Array.from(formFields);
    const removed = result.splice(startIndex, 1)[0]!;
    result.splice(endIndex, 0, removed);
    setFormFields(result);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => router.push('/dashboard/form')}
                className="rounded-lg h-8 w-8 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 cursor-pointer"
              >
                <IconArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="text-base font-medium text-neutral-900 dark:text-white">
                  {formTitle || 'Untitled Form'}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {formType.charAt(0).toUpperCase() + formType.slice(1)} Form
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/dashboard/form')}
                disabled={isCreating}
                className="text-sm h-9 px-4 rounded-lg cursor-pointer border-neutral-200 dark:border-zinc-800 text-neutral-600 dark:text-neutral-400"
              >
                Cancel
              </Button>
              <Button 
                onClick={createForm}
                disabled={isCreating || formFields.length === 0}
                className={cn(
                  "flex items-center gap-2 font-medium rounded-lg cursor-pointer",
                  "bg-primary hover:bg-primary/90 text-white dark:text-black dark:bg-primary",
                  "disabled:opacity-60 disabled:pointer-events-none transition-all duration-200",
                  "text-sm px-4 h-9"
                )}
              >
                <Save className="h-4 w-4" />
                {isCreating ? 'Creating...' : 'Create Form'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row">
          {/* Editor Panel */}
          <div className="w-full lg:w-1/2 border-r border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-y-auto">
            <div className="p-4">
              {isClient ? (
                <Tabs defaultValue="fields" className="w-full">
                  <TabsList className="bg-white dark:bg-zinc-900 p-1 h-auto flex space-x-1 overflow-x-auto border border-neutral-200 dark:border-zinc-800 rounded-lg mb-4">
                    <TabsTrigger 
                      value="fields" 
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 text-sm transition-all duration-150 cursor-pointer whitespace-nowrap",
                        "data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800",
                        "data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white",
                        "data-[state=inactive]:text-neutral-500 dark:data-[state=inactive]:text-neutral-400",
                        "data-[state=inactive]:hover:text-neutral-700 dark:data-[state=inactive]:hover:text-neutral-300",
                        "font-medium rounded-lg"
                      )}
                    >
                      <Grid3X3 className="h-4 w-4" />
                      <span>Fields</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="settings" 
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 text-sm transition-all duration-150 cursor-pointer whitespace-nowrap",
                        "data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800",
                        "data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white",
                        "data-[state=inactive]:text-neutral-500 dark:data-[state=inactive]:text-neutral-400",
                        "data-[state=inactive]:hover:text-neutral-700 dark:data-[state=inactive]:hover:text-neutral-300",
                        "font-medium rounded-lg"
                      )}
                    >
                      <SettingsIcon className="h-4 w-4" />
                      <span>Settings</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="fields" className="border-none p-0 mt-0">
                    <FieldConfigurationTab 
                      formFields={formFields}
                      availableFields={availableFields}
                      formType={formType}
                      onUpdateField={updateField}
                      onToggleField={toggleField}
                      onToggleRequired={toggleRequired}
                      onReorderFields={reorderFields}
                    />
                  </TabsContent>
                  
                  <TabsContent value="settings" className="border-none p-0 mt-0">
                    <FormSettingsTab 
                      formTitle={formTitle}
                      formDescription={formDescription}
                      onTitleChange={setFormTitle}
                      onDescriptionChange={setFormDescription}
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="animate-pulse">
                  <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg"></div>
                    <div className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg"></div>
                    <div className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Preview Panel */}
          <div className="w-full lg:w-1/2 overflow-y-auto ">
            <div className="p-4">
              <div className="shadow-sm">
                <FormPreview 
                  formTitle={formTitle}
                  formDescription={formDescription}
                  formFields={formFields}
                  formType={formType}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 