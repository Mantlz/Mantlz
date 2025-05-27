'use client';

import { CampaignHeaderSkeleton } from './CampaignHeaderSkeleton';
import { CampaignContentSkeleton } from './CampaignContentSkeleton';

export function CampaignDetailSkeleton() {
  return (
    <div className="container py-8 space-y-6">
      <CampaignHeaderSkeleton />
      <CampaignContentSkeleton />
    </div>
  );
} 