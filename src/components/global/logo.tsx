import Image from 'next/image'

interface LogoProps {
  className?: string
  size?: number
  forFavicon?: boolean
}

export function Logo({ className = '', size = 32, forFavicon = false }: LogoProps) {
  const src = forFavicon ? '/logo-favicon.svg' : '/logo-favicon.svg'
  
  return (
    <Image
      src={src}
      width={size}
      height={size}
      alt="Logo"
      className={className}
      priority
    />
  )
}
