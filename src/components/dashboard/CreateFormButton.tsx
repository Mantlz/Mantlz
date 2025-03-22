import React from 'react';
import { Button } from "@/components/ui/button";
import { client } from "@/lib/client";
import { toast } from "sonner";

export function CreateFormButton({ 
  templateId, 
  onSuccess 
}: { 
  templateId: 'feedback' | 'waitlist';
  onSuccess?: (formId: string) => void;
}) {
  const handleClick = async () => {
    try {
      const response = await client.forms.createFromTemplate.$post({
        templateId,
      });
      
      const formData = await response.json();
      
      toast.success('Form created successfully', {
        description: `Your ${templateId} form has been created.`,
        duration: 5000,
        //important: true,
        dismissible: true,
      });
      
      onSuccess?.(formData.id);
    } catch (error) {
      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes('Form limit reached')) {
          toast.error('Plan limit reached', {
            description: 'Please upgrade your plan to create more forms.',
            duration: 6000,
            //important: true,
            dismissible: true,
          });
        } else if (error.message.includes('Unauthorized')) {
          toast.error('Authentication required', {
            description: 'Please sign in to create forms.',
            duration: 5000,
            //important: true,
            dismissible: true,
          });
        } else {
          toast.error('Failed to create form', {
            description: error.message || 'An unexpected error occurred.',
            duration: 5000,
            //important: true,
            dismissible: true,
          });
        }
      } else {
        toast.error('Failed to create form', {
          description: 'An unexpected error occurred.',
          duration: 5000,
         // important: true,
          dismissible: true,
        });
      }
      console.error('Failed to create form:', error);
    }
  };

  return (
    <Button 
      onClick={handleClick}
      variant="outline"
      className="w-full mb-2"
    >
      Create {templateId === 'feedback' ? 'Feedback' : 'Waitlist'} Form
    </Button>
  );
} 