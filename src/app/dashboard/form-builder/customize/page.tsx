"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { client } from '@/lib/client'
import { FormType } from '@prisma/client'
import { FormField } from './types'
import { FieldConfigurationTab } from './_components/FieldConfigurationTab'
import { FormSettingsTab } from './_components/FormSettingsTab'
import { FormPreview } from './_components/FormPreview'
import { defaultFieldsByType, availableFieldsByType, formMetaByType } from './_components/form-config'
import { ArrowLeft, Save, Grid3X3, SettingsIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function CustomizeFormPage() {
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
    if (formType && !['waitlist', 'contact', 'feedback'].includes(formType)) {
      toast.error('Invalid form type')
      router.push('/dashboard/form-builder')
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
  
  const updateField = (id: string, property: string, value: any) => {
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
      const formSchema: Record<string, any> = {}
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

      const response = await client.forms.create.$post({
        name: formTitle,
        description: formDescription,
        schema: JSON.stringify(formSchema),
        formType: formTypeEnum,
      })
      
      const result = await response.json()
      toast.success('Form created successfully')
      router.push(`/dashboard/form/${result.id}`)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create form')
      console.error(error)
    } finally {
      setIsCreating(false)
    }
  }
  
  const moveField = (id: string, direction: 'up' | 'down') => {
    const index = formFields.findIndex(field => field.id === id);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < formFields.length) {
      // Create a new array with swapped elements
      const newFields = [...formFields];
      
      // Both elements should exist if we've made it this far
      const itemA = newFields[index]!;
      const itemB = newFields[targetIndex]!;
      
      newFields[index] = itemB;
      newFields[targetIndex] = itemA;
      setFormFields(newFields);
    }
  };

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
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center px-4 lg:px-6 sticky top-0 z-40">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.push('/dashboard/form-builder')}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                {formTitle || 'Untitled Form'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formType.charAt(0).toUpperCase() + formType.slice(1)} Form
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/dashboard/form-builder')}
              disabled={isCreating}
              className="text-sm h-9 px-4 rounded-lg"
            >
              Cancel
            </Button>
            <Button 
              onClick={createForm}
              disabled={isCreating || formFields.length === 0}
              className={cn(
                "text-sm h-9 px-4 rounded-lg flex items-center gap-2",
                "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              )}
            >
              <Save className="h-4 w-4" />
              {isCreating ? 'Creating...' : 'Create Form'}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content Area with Equal Width Sections */}
      <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row">
          {/* Editor Panel */}
          <div className="w-full lg:w-1/2 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-y-auto">
            <div className="p-5 lg:p-6">
              {isClient ? (
                <Tabs defaultValue="fields" className="w-full">
                  <TabsList className="flex w-full mb-6 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 p-0.5 bg-gray-50 dark:bg-zinc-900">
                    <TabsTrigger 
                      value="fields" 
                      className={cn(
                        "flex-1 rounded-lg py-2.5 text-sm font-medium",
                        "text-gray-700 dark:text-gray-300",
                        "data-[state=active]:text-primary data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800",
                        "data-[state=active]:shadow-sm data-[state=active]:border-none",
                        "transition-all duration-200"
                      )}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Grid3X3 className="h-4 w-4" />
                        <span>Fields</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="settings" 
                      className={cn(
                        "flex-1 rounded-lg py-2.5 text-sm font-medium",
                        "text-gray-700 dark:text-gray-300",
                        "data-[state=active]:text-primary data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800",
                        "data-[state=active]:shadow-sm data-[state=active]:border-none",
                        "transition-all duration-200"
                      )}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <SettingsIcon className="h-4 w-4" />
                        <span>Settings</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="fields" className="border-none p-0 mt-0">
                    <FieldConfigurationTab 
                      formFields={formFields}
                      availableFields={availableFields}
                      formType={formType}
                      onUpdateField={updateField}
                      onToggleField={toggleField}
                      onMoveField={moveField}
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
                  <div className="h-10 bg-gray-200 dark:bg-zinc-800 rounded-xl mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-20 bg-gray-100 dark:bg-zinc-900 rounded-xl"></div>
                    <div className="h-20 bg-gray-100 dark:bg-zinc-900 rounded-xl"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Preview Panel */}
          <div className="w-full lg:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950 overflow-y-auto">
            <div className="h-full flex items-start justify-center pt-10 px-6">
              <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
                {/* Form Preview with Scrolling */}
                <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
                  <FormPreview 
                    formTitle={formTitle}
                    formDescription={formDescription}
                    formFields={formFields}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 