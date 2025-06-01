'use client';
import { Suspense } from 'react';
import { LogsTable } from '@/components/dashboard/logs/LogsTable';

export default function LogsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Submission Logs</h1>
      <Suspense>
        <LogsTable itemsPerPage={6} />
      </Suspense>
    </div>
  );
}

