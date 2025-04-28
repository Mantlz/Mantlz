import { FeatureGrid } from "@/components/global/landing/feature";
import Footer from "@/components/global/landing/footer";
import { HeroSection } from "@/components/global/landing/hero-section";
import {Navbar} from "@/components/global/landing/navbar";
import { DashboardPreview } from "@/components/global/landing/preview";
import TrustedCompanies from "@/components/global/landing/trustedcompanies";
import { VersionBadge } from "@/components/global/landing/version-badge";
import { Container } from "@/components/global/landing/container";
import SoftwareComparison from "@/components/global/landing/software-comparison";
import Pricing from "@/components/global/landing/pricing";
import Faq from "@/components/global/landing/faq";
import BottomCTA from "@/components/global/landing/bottomcta";
import { Suspense } from "react";


export default function LandingPage() {
  return (
     <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Container>
        <Navbar />

        <main>
          <div className="mt-24 text-center">
            <div className="flex justify-center mb-10">
              <VersionBadge version="1.0.3" text="Introducing: Mantlz" />
            </div>
            <HeroSection />


            <div className="mt-16 pb-20 relative">
              {/* Larger grid dot background with extra padding */}
              <div className="absolute inset-0 -top-10 -bottom-20 -left-10 -right-10 bg-[radial-gradient(#d1d5db_2px,transparent_2px)] dark:bg-[radial-gradient(#666_2px,transparent_2px)] [background-size:24px_24px] opacity-80 rounded-3xl"></div>
              {/* Colored gradient with reduced opacity */}
              <div className="absolute inset-0 -top-10 -bottom-20 -left-10 -right-10 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 rounded-3xl blur-3xl opacity-50" />
              {/* Preview with floating effect */}
              <div className="relative z-10 transform translate-y-2">
                <DashboardPreview />
              </div>
            </div>
          </div>
      <TrustedCompanies />

          <FeatureGrid /> 
        </main>

      </Container>
      
      <SoftwareComparison />
      <Suspense>
        <Pricing />
      </Suspense>
      <Faq />
      <BottomCTA />
      <Footer />
    </div> 
   
  );
}


