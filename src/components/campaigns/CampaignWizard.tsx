"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContactsStep } from './steps/ContactsStep'
import { TemplateStep } from './steps/TemplateStep'
import { SettingsStep } from './steps/SettingsStep'
import { OverviewStep } from './steps/OverviewStep'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const STEPS = [
  { id: 'contacts', label: '1. Contacts' },
  { id: 'template', label: '2. Template' },
  { id: 'settings', label: '3. Settings' },
  { id: 'overview', label: '4. Overview' },
] as const

type StepId = typeof STEPS[number]['id']

interface CampaignWizardProps {
  formId: string
  onClose: () => void
}

export function CampaignWizard({ formId, onClose }: CampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState<StepId>('contacts')
  const [campaignData, setCampaignData] = useState({
    name: '',
    subject: '',
    content: '',
    selectedContacts: [] as string[],
    settings: {
      fromEmail: '',
      replyTo: '',
      scheduledAt: null as Date | null,
    }
  })

  const currentStepIndex = STEPS.findIndex(step => step.id === currentStep)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === STEPS.length - 1

  const handleNext = () => {
    if (!isLastStep) {
      const nextStep = STEPS[currentStepIndex + 1]
      if (nextStep) {
        setCurrentStep(nextStep.id)
      }
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      const prevStep = STEPS[currentStepIndex - 1]
      if (prevStep) {
        setCurrentStep(prevStep.id)
      }
    }
  }

  const updateCampaignData = (data: Partial<typeof campaignData>) => {
    setCampaignData(prev => ({ ...prev, ...data }))
  }

  return (
    <div className="container py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Create Campaign</h1>
        <p className="text-gray-500 dark:text-gray-400">Set up your email campaign in a few steps</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 shadow-sm p-6">
        <Tabs value={currentStep} className="space-y-6">
          <TabsList className="grid grid-cols-4 gap-2 sm:gap-4 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
            {STEPS.map(step => (
              <TabsTrigger
                key={step.id}
                value={step.id}
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:shadow"
                disabled
              >
                {step.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="contacts" className="pt-4">
            <ContactsStep
              formId={formId}
              selectedContacts={campaignData.selectedContacts}
              onSelect={(contacts) => updateCampaignData({ selectedContacts: contacts })}
            />
          </TabsContent>

          <TabsContent value="template" className="pt-4">
            <TemplateStep
              campaignData={campaignData}
              onUpdate={updateCampaignData}
            />
          </TabsContent>

          <TabsContent value="settings" className="pt-4">
            <SettingsStep
              settings={campaignData.settings}
              onUpdate={(settings) => updateCampaignData({ settings })}
            />
          </TabsContent>

          <TabsContent value="overview" className="pt-4">
            <OverviewStep campaignData={campaignData} formId={formId} onClose={onClose} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="text-gray-700 dark:text-gray-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={isLastStep ? onClose : handleNext}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100"
          >
            {isLastStep ? 'Close' : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 