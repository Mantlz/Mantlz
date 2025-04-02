'use client'

import { useRouter } from 'next/navigation'

interface CTASectionProps {
  title?: string
  description?: string
  buttonText?: string
  onButtonClick?: () => void
}

export function CTASection() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-zinc-800 dark:bg-zinc-600">
      <div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
        <div className="text-center text-sm font-medium text-white">
          Mantlz is in beta. Get the early adopter price!
        </div>
      </div>
    </div>
  )
} 