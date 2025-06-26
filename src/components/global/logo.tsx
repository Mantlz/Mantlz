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
  
  return (
    <div className={`flex items-center ${className}`}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#f97316" />
      <stop offset="100%" stopColor="#c2410c" />
    </linearGradient>
  </defs>
  <path d="M21.68 16.96l-3.13-7.31c-1.06-2.48-3.01-2.58-4.32-.22l-1.89 3.41c-.96 1.73-2.75 1.88-3.99.33l-.22-.28c-1.29-1.62-3.11-1.42-4.04.43l-1.72 3.45C1.16 19.17 2.91 22 5.59 22h12.76c2.6 0 4.35-2.65 3.33-5.04z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#gradient)"/>
  <path d="M7.86 9a3 3 0 100-6 3 3 0 000 6z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#gradient)"/>
</svg>
      {withText && (
        <span className="ml-2 font-bold text-xl bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
          Mantle
        </span>
      )}
    </div>
  )
}
