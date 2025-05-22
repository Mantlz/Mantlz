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
  <div className="relative group p-8 rounded-xl border border-orange-200 dark:border-orange-800/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
    {/* Gradient corners */}
    <div className="absolute -top-px -left-px w-8 h-8">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-orange-500 to-transparent dark:from-orange-400"></div>
      <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-orange-500 to-transparent dark:from-orange-400"></div>
    </div>
    <div className="absolute -top-px -right-px w-8 h-8">
      <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-orange-500 to-transparent dark:from-orange-400"></div>
      <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-orange-500 to-transparent dark:from-orange-400"></div>
    </div>
    <div className="absolute -bottom-px -left-px w-8 h-8">
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-orange-500 to-transparent dark:from-orange-400"></div>
      <div className="absolute bottom-0 left-0 h-full w-[2px] bg-gradient-to-t from-orange-500 to-transparent dark:from-orange-400"></div>
    </div>
    <div className="absolute -bottom-px -right-px w-8 h-8">
      <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-orange-500 to-transparent dark:from-orange-400"></div>
      <div className="absolute bottom-0 right-0 h-full w-[2px] bg-gradient-to-t from-orange-500 to-transparent dark:from-orange-400"></div>
    </div>

    <div className="relative z-10">
      <div className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-lg bg-orange-100 dark:bg-orange-900/20">
        <Icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
      </div>
      <h3 className="text-xl font-bold text-zinc-800 dark:text-white mb-3">{title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

export function OurServices() {
  return (
    <section className="py-24 relative overflow-hidden">      
      <Container className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            <span>Our Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 bg-clip-text text-transparent">
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