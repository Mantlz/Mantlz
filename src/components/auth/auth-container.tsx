import Image from "next/image"

interface AuthContainerProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthContainer({ children, title, subtitle }: AuthContainerProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {/* Logo/Brand Section */}
      <div className="flex flex-col items-center space-y-2 mb-4">
        <Image
          src="/logo.png"
          width={80}
          height={80}
          alt="Logo"
          className="rounded-lg"
        />
        <h1 className="text-2xl font-bold text-primary">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground text-center">
            {subtitle}
          </p>
        )}
      </div>

      {/* Auth Component Container */}
      <div 
        className="w-full max-w-md bg-card rounded-lg border border-border p-6 shadow-lg"
      >
        {children}
      </div>
    </div>
  )
} 