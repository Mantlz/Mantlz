import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { cn } from '../../utils/cn';
import { AlertCircle } from 'lucide-react';

interface ApiKeyErrorCardProps {
  className?: string;
  variant?: "default" | "glass";
  dashboardLink?: string;
  colorMode?: "light" | "dark";
}

export function ApiKeyErrorCard({
  className = '',
  //variant = "default",
  dashboardLink = "/dashboard/api-keys",
  colorMode = "light"
}: ApiKeyErrorCardProps) {
  return (
    <div className="flex items-center justify-center w-full">
      <Card 
        variant="error" 
        colorMode={colorMode}
        className={cn("w-full max-w-md shadow-sm", className)}
      >
        <CardHeader variant="error" colorMode={colorMode} className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle variant="error" colorMode={colorMode} className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              API Key Not Configured
            </CardTitle>
          </div>
          <div className={cn(
            "px-2 py-1 rounded text-xs font-medium",
            colorMode === "light" 
              ? "bg-red-100 text-red-800" 
              : "bg-red-900/30 text-red-400"
          )}>
            Required
          </div>
        </CardHeader>
        <CardContent variant="error" colorMode={colorMode}>
          <div className={cn(
            "p-3 rounded-md text-xs flex items-center mb-4",
            colorMode === "light"
              ? "bg-amber-50 border border-amber-200 text-amber-800"
              : "bg-amber-900/30 border border-amber-800/30 text-amber-400"
          )}>
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Add your API key to your environment variables to enable form functionality.</span>
          </div>
          
          <div className="bg-zinc-900 text-zinc-100 p-3 rounded text-xs overflow-x-auto mb-4">
            MANTLZ_KEY=mk_xxxxxxxxxxxxxxxxxxxx
          </div>
          
          <p className={cn(
            "text-sm mt-2 text-center",
            colorMode === "light" ? "text-zinc-600" : "text-zinc-400"
          )}>
            Get your API key from the <a href={dashboardLink} className={cn(
              "underline hover:text-blue-800", 
              colorMode === "light" ? "text-blue-600" : "text-blue-400 hover:text-blue-300"
            )}>Mantlz Dashboard</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 