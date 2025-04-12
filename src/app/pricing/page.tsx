import Footer from "@/components/global/landing/footer"
import Navbar from "@/components/global/landing/navbar"
import Pricing from "@/components/global/landing/pricing"

export default function PricingPage() {
  return (
    <>
    <Navbar/>
    <main className="min-h-screen ">

      <Pricing />
    </main>
    <Footer/>
    </>
  )
} 