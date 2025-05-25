"use client"
import { FeatureGrid } from "@/components/global/landing/feature";
import { AdvancedFeatureGrid } from "@/components/global/advancedfeature";
import Footer from "@/components/global/landing/footer";
import { HeroSection } from "@/components/global/landing/hero-section";
import {Navbar} from "@/components/global/landing/navbar";
import { DashboardPreview } from "@/components/global/landing/preview";
import TrustedCompanies from "@/components/global/landing/trustedcompanies";
import { Container } from "@/components/global/landing/container";
import PricingComparison from "@/components/global/landing/pricing-comparison";
import Pricing from "@/components/global/landing/pricing";
import Faq from "@/components/global/landing/faq";
import BottomCTA from "@/components/global/landing/bottomcta";
import { OurServices } from "@/components/global/landing/OurServices";
import { Suspense } from "react";

export default function LandingPage() {
  return (
     <div className="min-h-screen">
      <Container>
        <Navbar />

        <main>
          <div className="mt-24 text-center">
            <HeroSection />
            
            <div className="mt-20 pb-20 relative">
              <DashboardPreview />
            </div>
            <TrustedCompanies />


            <OurServices />
            <FeatureGrid /> 
            <AdvancedFeatureGrid />
          </div>
        </main>
      </Container>
      
      <Suspense>
        <Pricing />
      </Suspense>
      <PricingComparison />
      <Faq />
      <BottomCTA />
      <Footer />
    </div> 
  );
}


