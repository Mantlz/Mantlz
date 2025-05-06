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
    unsubscribed?: number;
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
  const [stats, setStats] = useState<{
    sentCount: number;
    totalOpens: number;
    totalClicks: number;
    uniqueOpens: number;
    uniqueClicks: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
  } | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
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

  useEffect(() => {
    if (campaign?.status === 'SENT' && isPremium) {
      fetchCampaignStats();
    }
  }, [campaign?.status, isPremium, campaignId]);

  const fetchCampaignStats = async () => {
    try {
      setLoadingStats(true);
      const response = await client.campaign.getStats.$get({
        campaignId
      });
      const statsData = await response.json();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

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
            
            // If campaign is now sent, fetch the stats
            if (typedCampaign.status === 'SENT' && isPremium) {
              fetchCampaignStats();
            }
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
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm">
        <div className="p-6 lg:p-8">
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
                            
                            // If campaign is now sent, fetch the stats
                            if (typedCampaign.status === 'SENT' && isPremium) {
                              fetchCampaignStats();
                            }
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
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{campaign._count?.sentEmails || 0}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Recipients</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{campaign.form?._count?.unsubscribed || 0}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Unsubscribed</p>
                  </div>
                </div>
              </div>
              
              {stats && campaign.status === 'SENT' && (
                <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{stats.openRate.toFixed(1)}%</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Open Rate</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Campaign Statistics</h3>
          {campaign.status === 'SENT' && !isPremium && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowUpgradeModal(true)}
              className="h-7 px-2 text-xs cursor-pointer gap-1 bg-white hover:bg-zinc-100 text-gray-600 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-gray-300 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-all duration-200"
            >
              Upgrade for Analytics
            </Button>
          )}
        </div>
        <div className="p-6">
          {campaign.status === 'SENT' ? (
            loadingStats ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-gray-100"></div>
              </div>
            ) : stats ? (
              <div className="space-y-8">
                {/* Basic stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-700 transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-600 shadow-sm">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                        <Mail className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      </div>
                      <p className="text-2xl font-medium text-gray-900 dark:text-white text-center">{stats.sentCount}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">Emails Sent</p>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-700 transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-600 shadow-sm">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                        <CheckCircle className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      </div>
                      <p className="text-2xl font-medium text-gray-900 dark:text-white text-center">{stats.uniqueOpens}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">Opened</p>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-700 transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-600 shadow-sm">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                        <Users className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      </div>
                      <p className="text-2xl font-medium text-gray-900 dark:text-white text-center">{stats.uniqueClicks}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">Clicked</p>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-700 transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-600 shadow-sm">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                        <Clock className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      </div>
                      <p className="text-2xl font-medium text-gray-900 dark:text-white text-center">{stats.openRate.toFixed(1)}%</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">Open Rate</p>
                    </div>
                  </div>
                </div>

                {/* Detailed metrics */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">Detailed Metrics</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-x divide-y divide-zinc-200 dark:divide-zinc-700">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Opens</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.totalOpens}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Unique Opens</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.uniqueOpens}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Open Rate</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.openRate.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.totalClicks}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Unique Clicks</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.uniqueClicks}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Click Rate</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.clickRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                {isPremium ? (
                  <div className="max-w-md mx-auto space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">Statistics could not be loaded. Please try again later.</p>
                    <Button 
                      variant="outline" 
                      className="mt-2" 
                      onClick={fetchCampaignStats}
                    >
                      Retry Loading Stats
                    </Button>
                  </div>
                ) : (
                  <div className="p-8 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg max-w-md mx-auto bg-gray-50 dark:bg-gray-900/50">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Advanced Analytics
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Unlock detailed campaign analytics, including open rates, click tracking, and performance metrics.
                    </p>
                    <Button 
                      className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-700 dark:hover:bg-gray-600 border-none" 
                      onClick={() => setShowUpgradeModal(true)}
                    >
                      Upgrade to Premium
                    </Button>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <div className="p-8 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg max-w-md mx-auto bg-gray-50 dark:bg-gray-900/50">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No statistics yet</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Statistics will be available after the campaign is sent to your form submissions.
                </p>
                
                {campaign.status === 'DRAFT' && (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
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
                              
                              // If campaign is now sent, fetch the stats
                              if (typedCampaign.status === 'SENT' && isPremium) {
                                fetchCampaignStats();
                              }
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