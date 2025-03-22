import Image from 'next/image'
import { useTheme } from 'next-themes'

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
  
  // Determine which logo to show based on theme or forced variant
  const logoSrc = variant === 'auto' 
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
