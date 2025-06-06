"use client";
import FeaturesSection from "@/components/global/landing/feature";
import Footer from "@/components/global/landing/footer";
import HeroSection from "@/components/global/landing/hero-section";
import { Navbar } from "@/components/global/landing/navbar";

import { Container } from "@/components/global/landing/container";
import Pricing from "@/components/global/landing/pricing";
import Faq from "@/components/global/landing/faq";
import BottomCTA from "@/components/global/landing/bottomcta";
import OurServices from "@/components/global/landing/OurServices";
import { Suspense } from "react";
import IntegrationsSection from "@/components/global/landing/integrations-6";
import CustomizeFormSection from "@/components/global/landing/customizeform";
import SecuritySection from "@/components/global/landing/security";
// import LogoCloud from "@/components/global/landing/logo-cloud";

export default function LandingPage() {
  return (
    <div className="min-h-screen ">
      <Container>
        <Navbar />

        <HeroSection />
        <div className="mt-20">
          {/* <LogoCloud /> */}
          <IntegrationsSection />
        </div>

        <OurServices />
        <CustomizeFormSection />
        <FeaturesSection />
        <SecuritySection />
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
