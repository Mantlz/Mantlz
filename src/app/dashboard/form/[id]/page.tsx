"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import { FormDetails } from '@/components/dashboard/form/FormDetails'

const FormDetailPage = () => {
  const params = useParams();
  const formId = params?.id as string;
  
  // ('FormDetailPage - formId:', formId);
  // ('FormDetailPage - params:', params);

  return (
    <FormDetails formId={formId} />
  )
}

export default FormDetailPage