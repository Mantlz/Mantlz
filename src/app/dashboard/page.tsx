'use client'
import { FormsList } from '@/components/dashboard/form/FormsList'
import { FormDetails } from '@/components/dashboard/form/FormDetails'
import { PaymentSuccessModal } from '@/components/payment/payment-success-modal'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useState, useEffect, Suspense } from 'react'

const DashboardPage = () => {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  )
}

const DashboardContent = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const formId = params?.id as string | undefined
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Load view mode from URL on initial render
  useEffect(() => {
    const viewParam = searchParams?.get('view') as 'grid' | 'list' | null
    if (viewParam === 'grid' || viewParam === 'list') {
      setViewMode(viewParam)
    }
  }, [searchParams])

  // Function to handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    // Update URL without causing a navigation/refresh
    const url = new URL(window.location.href)
    url.searchParams.set('view', mode)
    window.history.pushState({}, '', url)
  }

  return (
    <div className="container py-6">
      <PaymentSuccessModal />
      
      {formId ? (
        <FormDetails formId={formId} />
      ) : (
        <>
          <FormsList itemsPerPage={8} viewMode={viewMode} onViewModeChange={handleViewModeChange} />
        </>
      )}
    </div>
  )
}

export default DashboardPage