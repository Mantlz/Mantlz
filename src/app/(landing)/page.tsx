"use client"
import { FeatureGrid } from "@/components/global/landing/feature";
import { AdvancedFeatureGrid } from "@/components/global/advancedfeature";
import Footer from "@/components/global/landing/footer";
import { HeroSection } from "@/components/global/landing/hero-section";
import {Navbar} from "@/components/global/landing/navbar";
import { DashboardPreview } from "@/components/global/landing/preview";
import TrustedCompanies from "@/components/global/landing/trustedcompanies";
import { VersionBadge } from "@/components/global/landing/version-badge";
import { Container } from "@/components/global/landing/container";
import PricingComparison from "@/components/global/landing/pricing-comparison";
import Pricing from "@/components/global/landing/pricing";
import Faq from "@/components/global/landing/faq";
import BottomCTA from "@/components/global/landing/bottomcta";
import { OurServices } from "@/components/global/landing/OurServices";
import { Suspense } from "react";

export default function LandingPage() {
  return (
     <div className="min-h-screen ">
      <Container>
        <Navbar />

        <main>
          <div className="mt-24 text-center">

            <div className="flex justify-center mb-10">
              <VersionBadge version="0.3.2" text="Introducing: Mantlz" />
            </div>
            <HeroSection />


            <div className="mt-20 pb-20  relative">
            
              {/* <div className="absolute inset-0 -top-10 -bottom-20 -left-10 -right-10 bg-gradient-to-r from-blue-200/60 via-indigo-300/50 to-purple-200/60 dark:from-blue-800/30 dark:via-indigo-700/30 dark:to-purple-800/30  blur-3xl opacity-50"></div> */}
              {/* <div className="absolute inset-0 -top-10 -bottom-20 -left-10 -right-10 bg-gradient-to-r from-purple-200/60 via-indigo-300/50 to-blue-200/60 dark:from-blue-800/30 dark:via-indigo-700/30 dark:to-purple-800/30  blur-3xl opacity-50"></div> */}
              {/* <div className="absolute inset-0 -top-10 -bottom-20 -left-10 -right-10 bg-gradient-to-r from-purple-200/60 via-indigo-300/50 to-blue-200/60 dark:from-blue-800/30 dark:via-indigo-700/30 dark:to-purple-800/30  blur-3xl opacity-50"></div> */}



                <DashboardPreview />
                

            </div>
            
          </div>
      <TrustedCompanies />
      <OurServices />

          <FeatureGrid /> 
          <AdvancedFeatureGrid />
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


