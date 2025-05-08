'use client';
import { Suspense } from 'react';
import { LogsTable } from '@/components/dashboard/logs/LogsTable';
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Activity Logs | Dashboard',
  description: 'View your system activity and email campaign logs',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LogsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Submission Logs</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <LogsTable itemsPerPage={6} />
      </Suspense>
    </div>
  );
}

