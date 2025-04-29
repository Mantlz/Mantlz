"use client"
import dynamic from 'next/dynamic';

// Dynamically import the component with ssr disabled
const InstallCommandClient = dynamic(
  () => import('./install-command-client'),
  { ssr: false }
);

export function InstallCommand() {
  return <InstallCommandClient />;
} 