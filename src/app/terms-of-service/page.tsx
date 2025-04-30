"use client"
import React from 'react';
import { AlertCircle, Lock, Shield, UserCheck, Mail } from 'lucide-react';
import Footer from '@/components/global/landing/footer';
import { Navbar } from '@/components/global/landing/navbar';
import { Container } from '@/components/global/landing/container';

interface TermsSectionProps {
  title: string;
  children: React.ReactNode;
  icon: React.ElementType;
}

const TermsSection: React.FC<TermsSectionProps> = ({ title, children, icon: Icon }) => (
  <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 shadow-sm mb-6 border border-neutral-200 dark:border-zinc-800">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
        <Icon className="text-neutral-800 dark:text-neutral-200" size={20} />
      </div>
      <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-50">{title}</h2>
    </div>
    <div className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
      {children}
    </div>
  </div>
);

const TermsOfService: React.FC = () => (
  <div className="min-h-screen bg-white dark:bg-zinc-950">
    <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-zinc-950">
      <Container>
        <Navbar />
      </Container>
    </div>
    <main className="pt-32 pb-16">
      <Container>
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-5xl font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              Terms of Service
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-xl mx-auto">
              Last updated: April 2025
            </p>
          </header>

          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 text-neutral-600 dark:text-neutral-300 text-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-neutral-500 dark:text-neutral-400 mt-0.5 flex-shrink-0" />
                <p>
                  Please read these terms carefully. By using Mantlz, you agree to these conditions.
                  We may update these terms periodically to reflect changes in our services.
                </p>
              </div>
            </div>

            <TermsSection title="Acceptance of Terms" icon={UserCheck}>
              <p>
                By accessing or using the Mantlz service, you agree to be bound by these 
                <span className="font-medium"> Terms of Service </span> 
                and all applicable laws and regulations. Our commitment is to provide you with the best possible experience while ensuring a fair and transparent agreement.
              </p>
            </TermsSection>

            <TermsSection title="Service Description" icon={Shield}>
              <p>
                Mantlz provides <span className="font-medium">cutting-edge networking solutions</span> for businesses and individuals. Our services are designed to evolve with the rapidly changing tech landscape, and as such, may be subject to improvements and updates without prior notice. We strive to keep you informed of any significant changes that may affect your use of our platform.
              </p>
            </TermsSection>

            <TermsSection title="User Responsibilities" icon={Lock}>
              <p>
                As a valued user of Mantlz, you are entrusted with the responsibility of maintaining the confidentiality of your account information. This includes safeguarding your login credentials and ensuring that all activities occurring under your account are authorized. We recommend using strong, unique passwords and enabling two-factor authentication for enhanced security.
              </p>
            </TermsSection>

            <TermsSection title="Privacy and Data Protection" icon={Shield}>
              <p>
                Your privacy is paramount to us. The use of Mantlz is governed by our comprehensive Privacy Policy, which outlines how we collect, use, and protect your personal information. We employ industry-standard security measures to safeguard your data and comply with relevant data protection regulations. For full details, please refer to our Privacy Policy on our website.
              </p>
            </TermsSection>

            <TermsSection title="Intellectual Property Rights" icon={Lock}>
              <p>
                All content and materials available on Mantlz, including but not limited to text, graphics, website name, code, images and logos are the <span className="font-medium">intellectual property of Mantlz</span> and are protected by applicable copyright and trademark law. While we encourage the use of our services, unauthorized use, reproduction, or distribution of our intellectual property is strictly prohibited.
              </p>
            </TermsSection>

            <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 shadow-sm text-center border border-neutral-200 dark:border-zinc-800">
              <h3 className="text-neutral-800 dark:text-neutral-200 font-medium mb-3">Contact Us</h3>
              <a href="mailto:contact@mantlz.app" 
                className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
                <Mail className="w-4 h-4" />
                contact@mantlz.app
              </a>
            </div>
          </div>
        </div>
      </Container>
    </main>
    <Footer />
  </div>
);

export default TermsOfService;