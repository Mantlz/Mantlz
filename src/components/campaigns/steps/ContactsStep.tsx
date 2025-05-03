"use client"

import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/client'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Search } from 'lucide-react'

interface ContactsStepProps {
  formId: string
  selectedContacts: string[]
  onSelect: (contacts: string[]) => void
}

export function ContactsStep({ formId, selectedContacts, onSelect }: ContactsStepProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['form-submissions', formId],
    queryFn: async () => {
      const response = await client.forms.getFormSubmissions.$get({ formId })
      return response.json()
    }
  })

  const filteredSubmissions = submissions?.submissions?.filter(submission => {
    const email = submission.email?.toLowerCase() || ''
    return email.includes(searchQuery.toLowerCase())
  })

  const handleToggleAll = () => {
    if (selectedContacts.length === submissions?.submissions?.length) {
      onSelect([])
    } else {
      onSelect(submissions?.submissions?.map(s => s.id) || [])
    }
  }

  const handleToggleContact = (id: string) => {
    if (selectedContacts.includes(id)) {
      onSelect(selectedContacts.filter(c => c !== id))
    } else {
      onSelect([...selectedContacts, id])
    }
  }

  if (isLoading) {
    return <div>Loading contacts...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={selectedContacts.length === submissions?.submissions?.length}
          onCheckedChange={handleToggleAll}
        />
        <span className="text-sm text-gray-500">
          {selectedContacts.length} contacts selected
        </span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <ScrollArea className="h-[400px] border rounded-md">
        <div className="p-4 space-y-2">
          {filteredSubmissions?.map((submission) => (
            <div key={submission.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
              <Checkbox
                checked={selectedContacts.includes(submission.id)}
                onCheckedChange={() => handleToggleContact(submission.id)}
              />
              <div>
                <div className="font-medium">{submission.email}</div>
                <div className="text-sm text-gray-500">
                  Submitted on {new Date(submission.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 