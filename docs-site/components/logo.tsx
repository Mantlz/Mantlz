import Image from 'next/image'

interface LogoProps {
  className?: string
  size?: number
}

export function Logo({ 
  className = '', 
  size = 32
}: LogoProps) {
  return (
    <Image
      src="/logo.png"
      width={size}
      height={size}
      alt="Logo"
      className={className}
      priority
    />
  )
}
