"use client"
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
              {/* Square grid background with extra padding */}
              <div className="absolute inset-0 -top-10 -bottom-20 -left-10 -right-10 bg-[linear-gradient(to_right,#d1d5db_1px,transparent_1px),linear-gradient(to_bottom,#d1d5db_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#666_1px,transparent_1px),linear-gradient(to_bottom,#666_1px,transparent_1px)] [background-size:40px_40px] opacity-50 blur-[0.5px] rounded-3xl"></div>
              {/* Colored gradient with enhanced colors */}
              <div className="absolute inset-0 -top-10 -bottom-20 -left-10 -right-10 bg-gradient-to-r from-blue-200/60 via-indigo-300/50 to-purple-200/60 dark:from-blue-800/30 dark:via-indigo-700/30 dark:to-purple-800/30 rounded-3xl blur-3xl opacity-70"></div>
              {/* Additional subtle color accent */}
              <div className="absolute inset-0 -top-10 -bottom-20 -left-10 -right-10 bg-gradient-to-br from-cyan-100/40 to-transparent dark:from-cyan-900/20 rounded-3xl blur-2xl opacity-60"></div>
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


