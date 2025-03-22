'use client';

import React from 'react';
import { FeedbackForm, WaitlistForm } from '@mantlz/nextjs';
import { toast } from 'sonner';

export default function TestFormsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-bold mb-8">Test Forms</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <WaitlistForm
          onSubmitSuccess={(data) => {
            toast.success('Successfully joined the waitlist!');
          }}
          onSubmitError={(error) => {
            toast.error(error.message || 'Failed to join waitlist');
          }}
        />

        <FeedbackForm
          onSubmitSuccess={(data) => {
            toast.success('Thank you for your feedback!');
          }}
          onSubmitError={(error) => {
            toast.error(error.message || 'Failed to submit feedback');
          }}
        />
      </div>
    </div>
  );
}