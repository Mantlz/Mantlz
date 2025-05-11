"use client";
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface LogoProps {
  className?: string
  size?: number
  variant?: 'auto' | 'light' | 'dark'
}

export function Logo({ 
  className = '', 
  size = 32,
  variant = 'auto'
}: LogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Use useEffect to handle client-side rendering only
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // During SSR and initial mount, use a consistent logo
  // Only use theme-aware logo after client-side hydration
  const logoSrc = !mounted
    ? '/logo-dark.svg' // Default for SSR and initial render
    : variant === 'auto' 
      ? resolvedTheme === 'dark' ? '/logo-light.svg' : '/logo-dark.svg'
      : variant === 'light' ? '/logo-light.svg' : '/logo-dark.svg'
  
  return (
    <Image
      src={logoSrc}
      width={size}
      height={size}
      alt="Logo"
      className={className}
      priority
    />
  )
}
