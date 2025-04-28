"use client"
import React from 'react';
import { AlertCircle, Lock, Shield, Eye, Database, Mail } from 'lucide-react';
import Footer from '@/components/global/landing/footer';
import {Navbar} from '@/components/global/landing/navbar';


interface PolicySectionProps {
  title: string;
  children: React.ReactNode;
  icon: React.ElementType;
}

const PolicySection: React.FC<PolicySectionProps> = ({ title, children, icon: Icon }) => (
  <div className="p-6 rounded-xl bg-[#fffdf7] dark:bg-neutral-900 shadow-sm mb-6 border border-neutral-200 dark:border-neutral-800">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
        <Icon className="text-neutral-800 dark:text-neutral-200" size={20} />
      </div>
      <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-50">{title}</h2>
    </div>
    <div className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
      {children}
    </div>
  </div>
);

const PrivacyPolicy: React.FC = () => (
  <>
    <Navbar />
    <main className="bg-[#fffdf7] border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 min-h-screen pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 mt-10">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
            Privacy Policy
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-xl mx-auto">
            Last updated: April 2025
          </p>
        </header>

        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-300 text-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-neutral-500 dark:text-neutral-400 mt-0.5 flex-shrink-0" />
              <p>
                This privacy policy explains how we collect, use, and protect your personal information. 
                We may update this policy periodically to reflect changes in our practices.
              </p>
            </div>
          </div>

          <PolicySection title="Information We Collect" icon={Eye}>
            <p className="mb-2">
              At Mantlz, we collect various types of information to provide and improve our services:
            </p>
            <ul className="space-y-1 pl-1">
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 dark:text-neutral-500">•</span>
                <span>Personal information (e.g., name, email address, phone number)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 dark:text-neutral-500">•</span>
                <span>Usage data (e.g., how you interact with our services)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 dark:text-neutral-500">•</span>
                <span>Device and connection information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 dark:text-neutral-500">•</span>
                <span>Cookies and similar technologies</span>
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="How We Use Your Information" icon={Database}>
            <p className="mb-2">
              We use the collected information for various purposes, including:
            </p>
            <ul className="space-y-1 pl-1">
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 dark:text-neutral-500">•</span>
                <span>Providing and maintaining our services</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 dark:text-neutral-500">•</span>
                <span>Improving and personalizing user experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 dark:text-neutral-500">•</span>
                <span>Analyzing usage patterns and trends</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 dark:text-neutral-500">•</span>
                <span>Communicating with you about updates and offers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 dark:text-neutral-500">•</span>
                <span>Ensuring the security and integrity of our platform</span>
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="Data Protection" icon={Shield}>
            <p className="mb-2">
              Protecting your data is our top priority. We implement robust security measures to safeguard your personal information:
            </p>
            <ul className="space-y-1 pl-1">
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 dark:text-neutral-500">•</span>
                <span>Encryption of data in transit and at rest</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 dark:text-neutral-500">•</span>
                <span>Regular security audits and assessments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 dark:text-neutral-500">•</span>
                <span>Strict access controls and authentication procedures</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 dark:text-neutral-500">•</span>
                <span>Compliance with industry-standard data protection regulations</span>
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="Your Rights and Choices" icon={Lock}>
            <p className="mb-2">
              You have certain rights regarding your personal information:
            </p>
            <ul className="space-y-1 pl-1">
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 dark:text-neutral-500">•</span>
                <span>Access and update your personal information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 dark:text-neutral-500">•</span>
                <span>Request deletion of your data (subject to legal requirements)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 dark:text-neutral-500">•</span>
                <span>Opt-out of marketing communications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 dark:text-neutral-500">•</span>
                <span>Control cookie preferences</span>
              </li>
            </ul>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              To exercise these rights or for any privacy-related inquiries, please contact us.
            </p>
          </PolicySection>

          <div className="p-6 rounded-xl bg-[#fffdf7] dark:bg-neutral-900 shadow-sm text-center border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-neutral-800 dark:text-neutral-200 font-medium mb-3">Contact Us</h3>
            <a href="mailto:contact@mantlz.app" 
              className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
              <Mail className="w-4 h-4" />
              contact@mantlz.app
            </a>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default PrivacyPolicy;