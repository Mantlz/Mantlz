"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import FormDetails from '@/components/dashboard/FormDetails'

const FormDetailPage = () => {
  const params = useParams()
  const formId = params.id as string

  return (
    <FormDetails formId={formId} />
  )
}

export default FormDetailPage