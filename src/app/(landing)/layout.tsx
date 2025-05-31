import { landingMetadata } from '@/config/metadata'

export const metadata = landingMetadata

export default function LandingLayout({
  children,
}: {

  children: React.ReactNode
}) {

  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
} 