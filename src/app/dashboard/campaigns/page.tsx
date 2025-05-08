'use client';
import { Suspense } from 'react';
import { CampaignsTableWrapper as CampaignsTable } from '@/components/dashboard/campaigns/CampaignsTable';
import { UpgradeModal } from '@/components/modals/UpgradeModal';
import { useSubscription } from '@/hooks/useSubscription';
import { useState } from 'react';
import { Mail } from 'lucide-react';




export default function CampaignsPage() {
  const { isPremium } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Email Campaigns</h1>
      <Suspense>
        <CampaignsTable 
          itemsPerPage={6} 
          isPremium={isPremium}
          onUpgradeClick={() => setShowUpgradeModal(true)}
        />
      </Suspense>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Email Campaigns"
        featureIcon={<Mail className="h-5 w-5 text-slate-700 dark:text-slate-300" />}
        description="Create and manage email campaigns with advanced features like scheduling, analytics, and more. Available on Standard and Pro plans."
      />
    </div>
  );
} 