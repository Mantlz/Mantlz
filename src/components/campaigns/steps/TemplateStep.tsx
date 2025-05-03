"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'

interface TemplateStepProps {
  campaignData: {
    name: string
    subject: string
    content: string
  }
  onUpdate: (data: Partial<{ name: string; subject: string; content: string }>) => void
}

const VARIABLES = [
  { key: 'first_name', description: 'Recipient\'s first name' },
  { key: 'email', description: 'Recipient\'s email address' },
  { key: 'submission_date', description: 'Date of form submission' },
] as const

const TEMPLATES = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to {{company_name}}',
    content: `Hi {{first_name}},

Thank you for your interest in our service. We noticed you recently submitted our form and wanted to reach out.

Best regards,
The Team`
  },
  {
    id: 'follow-up',
    name: 'Follow Up',
    subject: 'Quick follow-up',
    content: `Hi {{first_name}},

I noticed you submitted our form on {{submission_date}}. I wanted to follow up and see if you had any questions.

Best regards,
The Team`
  }
]

export function TemplateStep({ campaignData, onUpdate }: TemplateStepProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'templates'>('write')

  const handleTemplateSelect = (template: typeof TEMPLATES[number]) => {
    onUpdate({
      subject: template.subject,
      content: template.content
    })
    setActiveTab('write')
  }

  const insertVariable = (variable: string) => {
    const textArea = document.querySelector('textarea')
    if (textArea) {
      const start = textArea.selectionStart
      const end = textArea.selectionEnd
      const text = textArea.value
      const before = text.substring(0, start)
      const after = text.substring(end)
      const newContent = `${before}{{${variable}}}${after}`
      onUpdate({ content: newContent })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Campaign Name</Label>
          <Input
            id="name"
            value={campaignData.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="e.g., Welcome Series - January"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Email Subject</Label>
          <Input
            id="subject"
            value={campaignData.subject}
            onChange={(e) => onUpdate({ subject: e.target.value })}
            placeholder="Enter email subject line"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'write' | 'templates')}>
        <TabsList>
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="space-y-4">
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={campaignData.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Write your email content here..."
              className="min-h-[300px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Variables</Label>
            <div className="flex flex-wrap gap-2">
              {VARIABLES.map((variable) => (
                <Button
                  key={variable.key}
                  variant="outline"
                  size="sm"
                  onClick={() => insertVariable(variable.key)}
                >
                  {variable.key}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid gap-4 md:grid-cols-2">
            {TEMPLATES.map((template) => (
              <Card key={template.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2">{template.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{template.subject}</p>
                <p className="text-sm text-gray-600 line-clamp-3">{template.content}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => handleTemplateSelect(template)}
                >
                  Use Template
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 