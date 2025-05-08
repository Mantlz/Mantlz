import Footer from "@/components/global/landing/footer"
import { Navbar } from "@/components/global/landing/navbar"
import Pricing from "@/components/global/landing/pricing"
import { Container } from "@/components/global/landing/container"
import Faq from "@/components/global/landing/faq"
import BottomCTA from "@/components/global/landing/bottomcta"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing | Mantle',
  description: 'Choose the perfect plan for your needs - Free, Standard, and Pro plans available',
  openGraph: {
    title: 'Pricing | Mantle',
    description: 'Choose the perfect plan for your needs - Free, Standard, and Pro plans available',
  },
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Container>
        <Navbar />
        <Pricing />
        <Faq />
        <BottomCTA />
      </Container>
      <Footer />
    </div>
  )
} 