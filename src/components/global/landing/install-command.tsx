"use client"
import { useState } from 'react';

export function InstallCommand() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('npm install @mantlz/nextjs');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-float rotate-12">
      <div className="bg-zinc-900 dark:bg-zinc-800 rounded-lg shadow-2xl p-4 border-2 border-zinc-700 dark:border-zinc-600 max-w-xs relative overflow-hidden">
        {/* Carton texture overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CiAgPHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-20"></div>
        
        {/* Carton fold lines */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-zinc-700 dark:border-zinc-600 opacity-50"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-zinc-700 dark:border-zinc-600 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-zinc-700 dark:border-zinc-600 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-zinc-700 dark:border-zinc-600 opacity-50"></div>

        <div className="flex items-center justify-between mb-2 relative z-10">
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Installation</span>
          <button 
            onClick={handleCopy}
            className="text-xs text-zinc-400 hover:text-white dark:hover:text-white transition-colors cursor-pointer"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="bg-black dark:bg-zinc-900 rounded p-3 font-mono text-sm text-white overflow-x-auto cursor-pointer relative z-10 shadow-inner" onClick={handleCopy}>
          <code>npm install @mantlz/nextjs</code>
        </div>
      </div>
    </div>
  );
} 