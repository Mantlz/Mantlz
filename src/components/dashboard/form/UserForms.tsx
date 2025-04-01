"use client"
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import { client } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, ArrowRight, Clock, FileSpreadsheet, LayoutGrid, ClipboardList } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FormCardSkeleton } from "@/components/skeletons/FormCardSkeleton";
import { NoFormsMessage } from "@/components/dashboard/form/NoFormsMessage";

interface Form {
  id: string;
  name: string;
  description?: string;
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
}

export function UserForms() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasForms, setHasForms] = useState<boolean | null>(null);
  
  // Check local storage on component mount to see if user had forms previously
  useEffect(() => {
    const storedHasForms = localStorage.getItem('userHasForms');
    if (storedHasForms !== null) {
      setHasForms(JSON.parse(storedHasForms));
    }
  }, []);
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userForms", cursor],
    queryFn: async () => {
      try {
        const response = await client.forms.getUserForms.$get(
          cursor ? { limit: 10, cursor } : { limit: 10 }
        );
        const result = await response.json();
        
        // Store whether user has forms for future visits
        const userHasForms = result.forms && result.forms.length > 0;
        localStorage.setItem('userHasForms', JSON.stringify(userHasForms));
        setHasForms(userHasForms);
        
        return result;
      } catch (err) {
        console.error("Error fetching forms:", err);
        throw err;
      }
    }
  });

  const handleLoadMore = () => {
    if (data?.nextCursor) {
      setCursor(data.nextCursor);
    }
  };

  // Always show the skeleton immediately when loading
  if (isLoading) {
    return (
      <div className="space-y-6 p-6 bg-gray-50 dark:bg-zinc-900 rounded-lg">
        <div className="border-b-2 border-dashed border-gray-300 dark:border-zinc-700 pb-5 mb-4">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-black dark:text-white">
                <ClipboardList className="h-7 w-7 text-gray-700 dark:text-gray-300" />
                Form Workspace
              </h1>
              <p className="text-sm text-muted-foreground mt-1 font-medium">
                Select a form to view detailed information and responses
              </p>
            </div>
          </div>
          
          <div className="flex mt-6">
            <div className="pb-3 border-b-2 border-black dark:border-white text-black dark:text-white  font-medium flex items-center gap-1.5">
              <LayoutGrid className="h-4 w-4" /> 
              ALL FORMS
            </div>
            <div className="ml-auto text-sm  text-muted-foreground">
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <FormCardSkeleton count={3} />
        </div>
        
        <div className="flex justify-center">
          <button 
            disabled
            className="mx-auto block mt-8  font-bold px-8 py-2 border-2 border-gray-300 dark:border-zinc-700 text-black dark:text-white opacity-50 rounded-md cursor-not-allowed"
          >
            LOAD MORE
          </button>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-zinc-900 rounded-lg border-2 border-gray-300 dark:border-zinc-700">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 dark:bg-zinc-800 mb-4 border-2 border-gray-300 dark:border-zinc-700">
          <AlertCircle className="h-8 w-8 text-gray-700 dark:text-gray-300" />
        </div>
        <h3 className="text-lg font-medium mb-2 ">Failed to load forms</h3>
        <p className="text-muted-foreground mb-4">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
        <Button onClick={() => window.location.reload()} className="bg-black dark:bg-white text-white dark:text-black  tracking-wide">Try Again</Button>
      </div>
    );
  }

  if (!data?.forms || data.forms.length === 0) {
    return <NoFormsMessage />;
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-zinc-900 rounded-lg">
      <div className="border-b-2 border-dashed border-gray-300 dark:border-zinc-700 pb-5 mb-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl  font-bold tracking-tight flex items-center gap-2 text-black dark:text-white">
              <ClipboardList className="h-7 w-7 text-gray-700 dark:text-gray-300" />
              Form Workspace
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              Select a form to view detailed information and responses
            </p>
          </div>
        </div>
        
        <div className="flex mt-6">
          <div className="pb-3 border-b-2 border-black dark:border-white text-black dark:text-white font-medium flex items-center gap-1.5">
            <LayoutGrid className="h-4 w-4" /> 
            ALL FORMS
          </div>
          {!isLoading && data?.forms && (
            <div className="ml-auto text-sm  text-muted-foreground">
              {data.forms.length} {data.forms.length === 1 ? 'form' : 'forms'}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {data.forms.map((form) => (
          <Link 
            href={`/dashboard/forms/${form.id}`} 
            key={form.id}
            passHref
          >
            <Card className="group relative bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden rounded-lg">
              {/* Geometric accent */}
              <div className="absolute top-0 left-0 h-full w-2 bg-black dark:bg-white"></div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-black dark:bg-white opacity-5 rounded-bl-full"></div>
              
              <div className="p-6 pl-7">
                {/* Icon and title with improved spacing */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="rounded-lg p-2.5 bg-gray-100 dark:bg-zinc-700 border-2 border-gray-200 dark:border-zinc-600">
                    <FileSpreadsheet className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <h3 className="font-bold text-lg line-clamp-1">
                    {form.name}
                  </h3>
                </div>
                
                {/* Form metadata with better organization */}
                <div className="flex items-center text-xs text-muted-foreground mb-4 ">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  <span>Created {format(new Date(form.createdAt), "MMM d, yyyy")}</span>
                </div>
                
                {/* View button area */}
                <div className="flex items-center justify-between">
                  <div className="text-xs  bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-zinc-600">
                    {form.submissionCount} {form.submissionCount === 1 ? "response" : "responses"}
                  </div>
                  
                  <div className="inline-flex items-center gap-1 text-sm font-bold text-black dark:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    VIEW FORM
                    <ArrowRight className="h-4 w-4 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
              
              {/* Bottom hover indicator */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-black dark:bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
            </Card>
          </Link>
        ))}
      </div>
      
      {data.nextCursor && (
        <Button 
          onClick={handleLoadMore} 
          variant="outline" 
          className="mx-auto block mt-8  font-bold px-8 py-2 border-2 border-gray-300 dark:border-zinc-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          LOAD MORE
        </Button>
      )}
    </div>
  );
} 