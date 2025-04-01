import { ClientRoot } from "@/components/providers/client-root"

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