import Image from 'next/image'
import { useEffect, useState } from 'react'

interface LogoProps {
  className?: string
  size?: number
  withText?: boolean
}

export function Logo({ 
  className = '', 
  size = 32,
  withText = false
}: LogoProps) {
  const [mounted, setMounted] = useState(false)
  
  // Use useEffect to handle client-side rendering only
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // We now use a single logo that works on all backgrounds
  const logoSrc = '/logo.svg'
  
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={logoSrc}
        width={size}
        height={size}
        alt="Mantle Logo"
        className="object-contain"
        priority
      />
      {withText && (
        <span className="ml-2 font-bold text-xl bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
          Mantle
        </span>
      )}
    </div>
  )
}
