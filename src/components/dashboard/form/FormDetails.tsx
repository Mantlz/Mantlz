import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { client } from '@/lib/client';

import { FormHeader } from './FormHeader';
import { FormSettings } from './FormSettings';
import { FormResponsesList } from './FormResponsesList';
import { SdkDocs } from './SdkDocs';
import { FormDetail } from './types';

// Accept formId as a prop
interface FormDetailsProps {
  formId?: string;
}

function FormDetails({ formId: propFormId }: FormDetailsProps = {}) {
  const router = useRouter();
  const params = useParams();
  
  // Get formId from either props or params
  const paramId = params?.id || '';
  const formId = propFormId || (typeof paramId === 'string' ? paramId : Array.isArray(paramId) ? paramId[0] : '');
  
  console.log('FormDetails - formId:', formId);
  console.log('FormDetails - params:', params);
  
  const [activeTab, setActiveTab] = useState<'responses' | 'settings' | 'integration'>('responses');

  // Fetch form details
  const { 
    data: form, 
    isLoading, 
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["formDetails", formId],
    queryFn: async () => {
      try {
        if (!formId) {
          throw new Error('Form ID is required');
        }
        
        console.log('Making API request with formId:', formId);
        const response = await client.forms.getFormById.$get({
          id: formId
        });
        return response.json();
      } catch (err) {
        console.error("Error fetching form details:", err);
        throw err;
      }
    },
    enabled: !!formId,
  });

  // Fetch form submissions
  const { 
    data: submissions, 
    isLoading: isLoadingSubmissions, 
    isError: isSubmissionsError,
    refetch: refetchSubmissions
  } = useQuery({
    queryKey: ["formSubmissions", formId],
    queryFn: async () => {
      try {
        if (!formId) {
          throw new Error('Form ID is required for submissions');
        }
        
        const response = await client.forms.getFormSubmissions.$get({
          formId: formId
        });
        return response.json();
      } catch (err) {
        console.error("Error fetching form submissions:", err);
        throw err;
      }
    },
    enabled: !!formId && activeTab === "responses"
  });

  const handleTabClick = (tab: 'responses' | 'settings' | 'integration') => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-zinc-900 rounded-lg p-8 border border-gray-200 dark:border-zinc-800">
        <div className="w-12 h-12 border-4 border-gray-200 dark:border-zinc-700 border-t-gray-500 dark:border-t-gray-400 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="text-center p-8 border border-red-200 dark:border-red-800 rounded-lg bg-white dark:bg-zinc-900 max-w-2xl mx-auto">
        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-xl font-mono font-bold text-red-600 dark:text-red-400 mb-3">Error Loading Form</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-md mx-auto">{(error as Error)?.message || "An unknown error occurred"}</p>
        <button 
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-medium rounded-md shadow-sm"
          onClick={() => refetch()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-6">
      {form && <FormHeader 
        id={formId as string} 
        name={form.name} 
        createdAt={form.createdAt} 
        responsesCount={submissions?.submissions?.length || 0} 
      />}

      <div className="flex flex-col flex-grow bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <nav className="flex border-b border-gray-200 dark:border-zinc-800 bg-gray-100 dark:bg-zinc-800/50 p-1">
          {[
            { id: 'responses', label: 'Responses' },
            { id: 'settings', label: 'Settings' },
            { id: 'integration', label: 'Integration' }
          ].map(tab => (
            <button
              key={tab.id}
              className={clsx(
                "px-5 py-3 text-base font-medium rounded-md transition-colors",
                activeTab === tab.id 
                  ? "bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 shadow-sm" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-zinc-800"
              )}
              onClick={() => handleTabClick(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-6">
          {activeTab === 'responses' && (
            <FormResponsesList 
              isLoading={isLoadingSubmissions}
              isError={isSubmissionsError}
              submissions={submissions} 
              onRetry={() => refetchSubmissions()}
            />
          )}
          {activeTab === 'settings' && (
            <FormSettings 
              name={form.name}
              description={form.description}
              onUpdate={(data) => console.log('Update form:', data)}
            />
          )}
          {activeTab === 'integration' && (
            <SdkDocs 
              formId={formId as string}
              formType="Form"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export { FormDetails };
