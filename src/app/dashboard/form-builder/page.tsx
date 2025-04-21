"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconMessageCircle2, IconUserPlus, IconMail } from "@tabler/icons-react"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const formTypes = [
  {
    id: 'waitlist',
    name: "Waitlist Form",
    description: "Collect waitlist signups for your product",
    icon: IconUserPlus,
  },
  {
    id: 'contact',
    name: "Contact Form",
    description: "Simple contact form for inquiries",
    icon: IconMail,
  },
  {
    id: 'feedback',
    name: "Feedback Form",
    description: "Collect user feedback and ratings",
    icon: IconMessageCircle2,
  }
]

export default function FormBuilderPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const handleContinue = () => {
    if (selectedType) {
      router.push(`/dashboard/form-builder/customize?type=${selectedType}`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen h-screen bg-gradient-to-b from-white to-gray-50 dark:from-neutral-950 dark:to-neutral-900">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="max-w-3xl w-full mx-auto flex flex-col">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-white tracking-tight leading-tight">
              Create a New Form
            </h1>
            <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
              Choose a template to jumpstart your design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-10 md:mb-12">
            {formTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <Card 
                  key={type.id}
                  className={cn(
                    "cursor-pointer transition-all duration-300 transform hover:scale-[1.02]",
                    "bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950",
                    isSelected 
                      ? 'ring-2 ring-primary/80 ring-offset-2 dark:ring-offset-neutral-950 shadow-lg shadow-primary/10' 
                      : 'hover:shadow-xl border-neutral-200/80 dark:border-neutral-800/80',
                    "rounded-2xl overflow-hidden h-full"
                  )}
                  onClick={() => setSelectedType(type.id)}
                >
                  <CardHeader className="p-5 md:p-6 pb-3">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-xl",
                        isSelected 
                          ? 'bg-primary/10 dark:bg-primary/20' 
                          : 'bg-neutral-100/80 dark:bg-neutral-800/80'
                      )}>
                        <Icon className={cn(
                          "h-6 w-6",
                           isSelected ? 'text-primary' : 'text-neutral-500 dark:text-neutral-400'
                        )} />
                      </div>
                      <CardTitle className="text-xl font-medium text-neutral-900 dark:text-white">{type.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 md:p-6 pt-2">
                    <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">{type.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center mt-auto">
            <Button 
              onClick={handleContinue}
              disabled={!selectedType}
              className={cn(
                "px-8 py-5 md:px-10 md:py-6 text-base font-medium rounded-xl",
                "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary",
                "text-white shadow-md shadow-primary/20",
                "disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 ease-in-out"
              )}
              size="lg"
            >
              Continue to Customization
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 