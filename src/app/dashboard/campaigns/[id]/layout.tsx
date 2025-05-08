import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Campaign ${params.id} | Dashboard`,
    description: 'Campaign details and analytics',
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default function CampaignDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 