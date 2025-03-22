'use client';

import React from 'react';
import { toast as sonnerToast, Toaster } from 'sonner';
import { WaitlistForm } from '../components/WaitlistForm';
import { MantlzProvider } from '../context/mantlzContext';
import { createSonnerToastAdapter } from '../adapters/sonner-toast';

// Create the Sonner toast adapter
const toastAdapter = createSonnerToastAdapter(sonnerToast);

export default function ToastExample() {
  const apiKey = process.env.NEXT_PUBLIC_MANTLZ_API_KEY || 'your-api-key';
  
  return (
    <div>
      {/* Add the Sonner Toaster component at the top level */}
      <Toaster position="top-right" />
      
      <MantlzProvider 
        apiKey={apiKey}
        clientConfig={{
          toastHandler: toastAdapter,
          notifications: true,
        }}
      >
        <h1>Waitlist Form with Toast Notifications</h1>
        <p>Submit the form to see toast notifications in action.</p>
        
        <WaitlistForm 
          onSubmitSuccess={(data) => {
            console.log('Form submitted successfully:', data);
          }}
          onSubmitError={(error) => {
            console.error('Form submission error:', error);
          }}
        />
      </MantlzProvider>
    </div>
  );
} 