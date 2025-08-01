import React from 'react';
import { AlertCircle, Lock, Shield, Globe, Database, Mail } from 'lucide-react';
import Footer from '@/components/global/landing/footer';
import { Navbar } from '@/components/global/landing/navbar';
import { Container } from '@/components/global/landing/container';

interface PrivacySectionProps {
  title: string;
  children: React.ReactNode;
  icon: React.ElementType;
}

const PrivacySection: React.FC<PrivacySectionProps> = ({ title, children, icon: Icon }) => (
  <div className="p-6 rounded-xl  mb-6 border border-neutral-200 dark:border-zinc-800">
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

const PrivacyPage: React.FC = () => (
  <div className="min-h-screen ">
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-background/95 backdrop-blur-sm ">
      <Container>
        <Navbar />
      </Container>
    </div>
    <main className="pt-32 pb-16 relative z-10">
      <Container>
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-5xl font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              Privacy & GDPR
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-xl mx-auto">
              Last updated: April 2025
            </p>
          </header>

          <div className="space-y-6">
            <div className="p-4 rounded-xl  text-neutral-600 dark:text-neutral-300 text-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-neutral-500 dark:text-neutral-400 mt-0.5 flex-shrink-0" />
                <p>
                  This privacy notice explains how we collect, use, and protect your personal information in compliance with GDPR and other data protection regulations.
                </p>
              </div>
            </div>

            <PrivacySection title="Data We Collect" icon={Database}>
              <p className="mb-2">
                We collect various types of information to provide and improve our services:
              </p>
              <ul className="space-y-1 pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500">•</span>
                  <span>Location data (country, region, city)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500">•</span>
                  <span>Device information (type, browser, OS)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500">•</span>
                  <span>Usage data and analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500">•</span>
                  <span>Form submission data</span>
                </li>
              </ul>
            </PrivacySection>

            <PrivacySection title="How We Use Your Data" icon={Globe}>
              <p className="mb-2">
                Your data is used for the following purposes:
              </p>
              <ul className="space-y-1 pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500">•</span>
                  <span>Providing and improving our services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500">•</span>
                  <span>Analyzing usage patterns and trends</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500">•</span>
                  <span>Ensuring platform security</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500">•</span>
                  <span>Personalizing user experience</span>
                </li>
              </ul>
            </PrivacySection>

            <PrivacySection title="Data Protection" icon={Shield}>
              <p className="mb-2">
                We implement robust security measures to protect your data:
              </p>
              <ul className="space-y-1 pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500">•</span>
                  <span>Encryption of data in transit and at rest</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500">•</span>
                  <span>Regular security audits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500">•</span>
                  <span>Access controls and authentication</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500">•</span>
                  <span>GDPR-compliant data processing</span>
                </li>
              </ul>
            </PrivacySection>

            <PrivacySection title="Your Rights" icon={Lock}>
              <p className="mb-2">
                Under GDPR, you have the following rights:
              </p>
              <ul className="space-y-1 pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500">•</span>
                  <span>Access your personal data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500">•</span>
                  <span>Correct inaccurate data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500">•</span>
                  <span>Request data deletion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500">•</span>
                  <span>Object to data processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500">•</span>
                  <span>Data portability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500">•</span>
                  <span>Withdraw consent</span>
                </li>
              </ul>
            </PrivacySection>

            <div className="p-6 rounded-xl text-center border border-neutral-200 dark:border-zinc-800">
              <h3 className="text-neutral-800 dark:text-neutral-200 font-medium mb-3">Contact Us</h3>
              <a href="mailto:privacy@mantlz.com" 
                className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
                <Mail className="w-4 h-4" />
                privacy@mantlz.com
              </a>
            </div>
          </div>
        </div>
      </Container>
    </main>
    <Footer />
  </div>
);

export const dynamic = 'force-static'

export default PrivacyPage;