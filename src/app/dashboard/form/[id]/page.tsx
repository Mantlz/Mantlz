'use client'
import React from 'react'
import { useParams } from 'react-router'
import { FormDetails } from '@/components/dashboard/form/FormDetails'
import { ClientRoot } from '@/components/providers/client-root'

const FormDetailPage = () => {
  const params = useParams();
  const formId = params?.id as string;
  
  return (
    <ClientRoot>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-6 mt-14">
          <FormDetails formId={formId} />
        </main>
      </div>
    </ClientRoot>
  )
}

export default FormDetailPage