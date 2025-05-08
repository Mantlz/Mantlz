import { ClientRoot } from "@/components/providers/client-root"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Mantle',
  description: 'Manage your campaigns and forms in one place',
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientRoot>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-6 mt-14">
          {children}
        </main>
      </div>
    </ClientRoot>
  )
}