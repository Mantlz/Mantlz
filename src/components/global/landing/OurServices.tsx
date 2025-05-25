import React from 'react';
import { Container } from './container';
import { Sparkles, Mail, FileText, Bell, Upload } from 'lucide-react';

const ServiceCard = ({ 
  title, 
  description, 
  icon: Icon 
}: { 
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>
}) => (
  <div className="relative group p-8 rounded-lg bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-600 transform-gpu translate-y-[-4px] translate-x-[-4px] hover:translate-y-[-8px] hover:translate-x-[-8px] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)]">
    <div className="relative z-10">
      <div className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-2 border-black dark:border-zinc-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)]">
        <Icon className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
      </div>
      <h3 className="text-xl font-bold text-zinc-800 dark:text-white mb-3">{title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

export function OurServices() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]" />
      
      <Container className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-extrabold bg-orange-500 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            <span>Our Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
            Everything you need
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Powerful form management with integrated email campaigns, payments, and analytics all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ServiceCard
            icon={FileText}
            title="Form Services"
            description="Create and manage dynamic forms with our powerful form service. Built-in validation and customization options."
          />
          <ServiceCard
            icon={Mail}
            title="Email Campaign"
            description="Send welcome emails, campaign updates, and track email engagement with our comprehensive email services."
          />
          <ServiceCard
            icon={Upload}
            title="Export Tools"
            description="Export your form submissions and data in multiple formats for easy analysis and backup."
          />
          <ServiceCard
            icon={Bell}
            title="Notifications"
            description="Real-time notifications and alerts for form submissions, payments, and system events."
          />
        </div>
      </Container>
    </section>
  );
} 