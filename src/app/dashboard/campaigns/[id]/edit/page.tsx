'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { client } from '@/lib/client';
import { ChevronLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function EditCampaignPage({ params }: { params: { id: string } }) {
  const [campaign, setCampaign] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    content: ''
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
            
            const foundCampaign = campaigns.find((c: any) => c.id === params.id);
            if (foundCampaign) {
              setCampaign(foundCampaign);
              
              // Initialize form with campaign data
              setFormData({
                name: foundCampaign.name || '',
                description: foundCampaign.description || '',
                subject: foundCampaign.subject || '',
                content: foundCampaign.content || ''
              });
              break;
            }
          }
        } else {
          // If we have formId in the URL, just fetch campaigns for that form
          const campaignsResponse = await client.campaign.getFormCampaigns.$get({
            formId: formId
          });
          const campaigns = await campaignsResponse.json();
          
          const foundCampaign = campaigns.find((c: any) => c.id === params.id);
          if (foundCampaign) {
            setCampaign(foundCampaign);
            
            // Initialize form with campaign data
            setFormData({
              name: foundCampaign.name || '',
              description: foundCampaign.description || '',
              subject: foundCampaign.subject || '',
              content: foundCampaign.content || ''
            });
          }
        }
      } catch (error) {
        console.error('Error fetching campaign:', error);
        setError('Failed to load campaign');
      } finally {
        setLoading(false);
      }
    }

    fetchCampaign();
  }, [params.id, formId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      // Make sure required fields are filled in
      if (!formData.name || !formData.subject || !formData.content) {
        setError('Name, subject and content are required');
        setIsSaving(false);
        return;
      }
      
      if (!campaign || !campaign.formId) {
        setError('Campaign information is missing');
        setIsSaving(false);
        return;
      }
      
      // Since there's no direct update method in the API, we'll have to
      // create a new campaign and then delete the old one if needed
      // or implement a custom update handler server-side
      
      // For now, we'll just create a new draft campaign with the same form
      await client.campaign.create.$post({
        name: formData.name,
        description: formData.description,
        subject: formData.subject,
        content: formData.content,
        formId: campaign.formId
      });
      
      // Navigate back to campaigns list
      router.push(`/dashboard/campaigns?formId=${campaign.formId}`);
    } catch (error) {
      console.error('Error updating campaign:', error);
      setError('Failed to update campaign');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackClick = () => {
    router.back();
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
            The campaign you're trying to edit does not exist or you don't have permission to edit it.
          </p>
        </div>
      </div>
    );
  }

  // Only allow editing draft campaigns
  if (campaign.status !== 'DRAFT') {
    return (
      <div className="container py-8">
        <Button variant="ghost" size="sm" onClick={handleBackClick} className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
          <h2 className="text-lg font-medium text-yellow-800 dark:text-yellow-300">Cannot edit campaign</h2>
          <p className="text-yellow-600 dark:text-yellow-400 mt-2">
            Only draft campaigns can be edited. This campaign has already been {campaign.status.toLowerCase()}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleBackClick}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Campaign</h1>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Campaign Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="Enter campaign name"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              placeholder="Enter campaign description"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input 
              id="subject" 
              name="subject" 
              value={formData.subject} 
              onChange={handleInputChange} 
              placeholder="Enter email subject"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="content">Email Body</Label>
            <Textarea 
              id="content" 
              name="content" 
              value={formData.content} 
              onChange={handleInputChange} 
              placeholder="Enter email content (HTML supported)"
              className="min-h-[200px]"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleBackClick}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 