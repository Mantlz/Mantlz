'use client';
import { Suspense } from 'react';
import { CampaignsTable } from '@/components/dashboard/campaigns/CampaignsTable';

export default function CampaignsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Email Campaigns</h1>
      <Suspense>
        <CampaignsTable itemsPerPage={6} />
      </Suspense>
    </div>
  );
} 