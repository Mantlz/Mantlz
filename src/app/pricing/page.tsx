import Footer from "@/components/global/landing/footer"
import { Navbar } from "@/components/global/landing/navbar"
import Pricing from "@/components/global/landing/pricing"
import { Container } from "@/components/global/landing/container"
import Faq from "@/components/global/landing/faq"
import BottomCTA from "@/components/global/landing/bottomcta"
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