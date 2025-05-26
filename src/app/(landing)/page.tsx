"use client"
import FeaturesSection from "@/components/global/landing/feature";
import AdvancedFeatureGrid from "@/components/global/landing/advancedfeature";
import Footer from "@/components/global/landing/footer";
import { HeroSection } from "@/components/global/landing/hero-section";
import {Navbar} from "@/components/global/landing/navbar";
import { DashboardPreview } from "@/components/global/landing/preview";

import { Container } from "@/components/global/landing/container";
import PricingComparison from "@/components/global/landing/pricing-comparison";
import Pricing from "@/components/global/landing/pricing";
import Faq from "@/components/global/landing/faq";
import BottomCTA from "@/components/global/landing/bottomcta";
import OurServices from "@/components/global/landing/OurServices";
import { Suspense } from "react";
import IntegrationsSection from "@/components/global/landing/integrations-6";
import LogoCloud from "@/components/global/landing/logo-cloud";

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
            <LogoCloud />



            <OurServices />
            <FeaturesSection /> 
            <IntegrationsSection />
            <AdvancedFeatureGrid />
          </div>
        </main>
      </Container>
      
      <Suspense>
        <Pricing />
      </Suspense>
      <Faq />
      <BottomCTA />
      <Footer />
    </div> 
  );
}


