'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { client } from '@/lib/client';
import { ChevronLeft, Send, Mail, Clock, CheckCircle, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCampaignStatus } from '@/components/dashboard/campaigns/table/tableUtils';
import { formatDistanceToNow } from 'date-fns';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradeModal } from '@/components/modals/UpgradeModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { SendCampaignDialog } from '@/components/dashboard/campaigns/dialogs/SendCampaignDialog'
import { ScheduleCampaignDialog } from '@/components/dashboard/campaigns/dialogs/ScheduleCampaignDialog'

interface CampaignDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface FormData {
  id: string;
  _count?: {
    submissions: number;
  };
  name?: string;
  userId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  description?: string | null;
  schema?: string;
  settings?: unknown;
  formType?: string;
}

type CampaignStatus = 'SENT' | 'FAILED' | 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'CANCELLED';

interface Campaign {
  id: string;
  name: string;
  description?: string | null;
  status: CampaignStatus;
  subject: string;
  content: string;
  createdAt: Date | string;
  formId?: string;
  form?: FormData;
  _count?: {
    sentEmails: number;
  };
}

// Helper function to validate campaign status
function isCampaignStatus(status: string): status is CampaignStatus {
  return ['SENT', 'FAILED', 'DRAFT', 'SCHEDULED', 'SENDING', 'CANCELLED'].includes(status);
}

export default function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const campaignId = unwrappedParams.id;
  
  const { isPremium, userPlan } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get('formId');

  useEffect(() => {
    async function fetchCampaign() {
      try {
        setLoading(true);
        
        // First we need to find which form this campaign belongs to
        // If we don't have formId in the URL, we need to try all forms the user has
        if (!formId) {
          // Get user forms
          const formsResponse = await client.forms.getUserForms.$get();
          const formsData = await formsResponse.json();
          
          // Try each form to find the campaign
          for (const form of formsData.forms) {
            const campaignsResponse = await client.campaign.getFormCampaigns.$get({
              formId: form.id
            });
            const campaigns = await campaignsResponse.json();
            
            const foundCampaign = campaigns.find((c: unknown) => {
              const campaign = c as Partial<Campaign>;
              return campaign.id === campaignId;
            });
            
            if (foundCampaign) {
              const typedCampaign = foundCampaign as unknown as Partial<Campaign>;
              // Validate status
              if (typedCampaign.status && isCampaignStatus(typedCampaign.status)) {
                setCampaign(typedCampaign as Campaign);
                break;
              }
            }
          }
        } else {
          // If we have formId in the URL, just fetch campaigns for that form
          const campaignsResponse = await client.campaign.getFormCampaigns.$get({
            formId: formId
          });
          const campaigns = await campaignsResponse.json();
          
          const foundCampaign = campaigns.find((c: unknown) => {
            const campaign = c as Partial<Campaign>;
            return campaign.id === campaignId;
          });
          
          if (foundCampaign) {
            const typedCampaign = foundCampaign as unknown as Partial<Campaign>;
            // Validate status
            if (typedCampaign.status && isCampaignStatus(typedCampaign.status)) {
              setCampaign(typedCampaign as Campaign);
            }
          } else {
            setCampaign(null);
          }
        }
      } catch (error) {
        console.error('Error fetching campaign:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCampaign();
  }, [campaignId, formId]);

  const handleSendCampaign = async () => {
    if (!isPremium) {
      setShowUpgradeModal(true);
      return;
    }
    try {
      setIsSending(true);
      await client.campaign.send.$post({
        campaignId: campaignId,
        recipientSettings: {
          type: "first",
          count: 100
        }
      });
      
      // Fetch the campaign again to get updated status
      if (campaign?.formId) {
        const campaignsResponse = await client.campaign.getFormCampaigns.$get({
          formId: campaign.formId
        });
        const campaigns = await campaignsResponse.json();
        
        const updatedCampaign = campaigns.find((c: unknown) => {
          const campaign = c as Partial<Campaign>;
          return campaign.id === campaignId;
        });
        
        if (updatedCampaign) {
          const typedCampaign = updatedCampaign as unknown as Partial<Campaign>;
          if (typedCampaign.status && isCampaignStatus(typedCampaign.status)) {
            setCampaign(typedCampaign as Campaign);
          }
        }
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleBackClick = () => {
    if (campaign?.formId) {
      // Go back to campaigns list for this form
      router.push(`/dashboard/campaigns?formId=${campaign.formId}`);
    } else {
      router.push('/dashboard/campaigns');
    }
  };

  if (loading) {
    return (
      <div className="container py-8 space-y-6">
        <div className="h-6 w-36 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        <div className="grid gap-6 mt-6">
          <div className="h-32 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse"></div>
          <div className="h-64 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container py-8">
        <Button variant="ghost" size="sm" onClick={handleBackClick} className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-lg font-medium text-red-800 dark:text-red-300">Campaign not found</h2>
          <p className="text-red-600 dark:text-red-400 mt-2">
            The campaign you&apos;re looking for does not exist or you don&apos;t have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  const statusInfo = formatCampaignStatus(campaign.status);
  
  return (
    <div className="container py-8 space-y-6">
      {/* Top Header Section */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div className="relative p-6 lg:p-8">
          <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg px-3"
                    onClick={handleBackClick}
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                    <span className="hidden xs:inline">Back to Campaigns</span>
                  </Button>
                  <Badge variant="outline" className={statusInfo.color}>
                    {statusInfo.label}
                  </Badge>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  {campaign.name}
                </h1>
              </div>
              
              {campaign.status === 'DRAFT' && (
                <div className="flex items-center gap-2">
                  <SendCampaignDialog
                    campaignId={campaignId}
                    onSent={async () => {
                      // Refresh campaign data after sending
                      if (campaign?.formId) {
                        const campaignsResponse = await client.campaign.getFormCampaigns.$get({
                          formId: campaign.formId
                        });
                        const campaigns = await campaignsResponse.json();
                        
                        const updatedCampaign = campaigns.find((c: unknown) => {
                          const campaign = c as Partial<Campaign>;
                          return campaign.id === campaignId;
                        });
                        
                        if (updatedCampaign) {
                          const typedCampaign = updatedCampaign as unknown as Partial<Campaign>;
                          if (typedCampaign.status && isCampaignStatus(typedCampaign.status)) {
                            setCampaign(typedCampaign as Campaign);
                          }
                        }
                      }
                    }}

                    onUpgradeClick={() => setShowUpgradeModal(true)}
                    userPlan={userPlan}
                  />
                  
                  <ScheduleCampaignDialog
                    campaignId={campaignId}
                    onScheduled={async () => {
                      // Refresh campaign data after scheduling
                      if (campaign?.formId) {
                        const campaignsResponse = await client.campaign.getFormCampaigns.$get({
                          formId: campaign.formId
                        });
                        const campaigns = await campaignsResponse.json();
                        
                        const updatedCampaign = campaigns.find((c: unknown) => {
                          const campaign = c as Partial<Campaign>;
                          return campaign.id === campaignId;
                        });
                        
                        if (updatedCampaign) {
                          const typedCampaign = updatedCampaign as unknown as Partial<Campaign>;
                          if (typedCampaign.status && isCampaignStatus(typedCampaign.status)) {
                            setCampaign(typedCampaign as Campaign);
                          }
                        }
                      }
                    }}
                    isPremium={isPremium}
                    onUpgradeClick={() => setShowUpgradeModal(true)}
                    userPlan={userPlan}
                  />
                </div>
              )}
            </div>
            
            {/* Description */}
            {campaign.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
                {campaign.description}
              </p>
            )}
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{campaign._count?.sentEmails || 0}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Recipients</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{campaign.form?._count?.submissions || 0}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Unsubscribed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-lg font-semibold">Campaign Statistics</h3>
        </div>
        <div className="p-6">
          {campaign.status === 'SENT' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
                <Mail className="h-8 w-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
                <p className="text-2xl font-bold">{campaign._count?.sentEmails || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Emails Sent</p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center">
                <CheckCircle className="h-8 w-8 mx-auto text-green-600 dark:text-green-400 mb-2" />
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Opened</p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg text-center">
                <Users className="h-8 w-8 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Clicked</p>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg text-center">
                <Clock className="h-8 w-8 mx-auto text-amber-600 dark:text-amber-400 mb-2" />
                <p className="text-2xl font-bold">0%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Open Rate</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No statistics yet</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Statistics will be available after the campaign is sent to your form submissions.
              </p>
              
              {campaign.status === 'DRAFT' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="mt-6 gap-1">
                      <Send className="h-4 w-4" />
                      Send Campaign Now
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Send Campaign</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to send this campaign? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSendCampaign} disabled={isSending}>
                        {isSending ? 'Sending...' : 'Send Campaign'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}
        </div>
      </div>

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