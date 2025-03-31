import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileSpreadsheet, Clock, ArrowRight, Users, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormCardSkeletonProps {
  count?: number;
}

export function FormCardSkeleton({ count = 6 }: FormCardSkeletonProps) {
  return (
    <div className="space-y-8">
      {/* Dashboard Header with Enhanced Retro Grid */}
      <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-8 bg-white dark:bg-zinc-900 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        {/* Retro Grid Pattern with Glow */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                             linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}></div>
        </div>
        
        {/* Retro Corner Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform -translate-x-16 -translate-y-16 rotate-45"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform translate-x-16 translate-y-16 rotate-45"></div>
        
        <div className="relative">
          <h1 className="text-4xl  font-bold text-zinc-900 dark:text-white tracking-tight">
            Welcome back, <Skeleton className="inline-block h-8 w-32 align-middle" /> 
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 ">
            Here's an overview of your forms
          </p>
        </div>
        <Button
          className="relative bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 px-6 py-6 text-base group"
        >
          <span className="absolute inset-0 bg-black dark:bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
          <Plus className="h-5 w-5 mr-2 relative" />
          Create New Form
        </Button>
      </div>

   

      {/* Statistics Cards with Enhanced Retro Style */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          {/* Retro Corner Accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform rotate-45 translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform rotate-45 -translate-x-16 translate-y-16"></div>
          
          <div className="flex items-center gap-4 relative">
            <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 group-hover:scale-110 transition-transform duration-300">
              <FileSpreadsheet className="h-6 w-6 text-zinc-900 dark:text-white" />
            </div>
            <div>
              <Skeleton className="h-2 w-20  rounded-md" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400 ">Total Forms</p>

              <div className="text-3xl font-bold  text-zinc-900 dark:text-white">
                <Skeleton className="h-8 w-10 rounded-md" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform rotate-45 translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform rotate-45 -translate-x-16 translate-y-16"></div>
          
          <div className="flex items-center gap-4 relative">
            <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-6 w-6 text-zinc-900 dark:text-white" />
            </div>
            <div>
              <Skeleton className="h-2 w-20 rounded-md" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400 ">Total Responses</p>

              <div className="text-3xl font-bold  text-zinc-900 dark:text-white">
                <Skeleton className="h-8 w-10 rounded-md" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform rotate-45 translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform rotate-45 -translate-x-16 translate-y-16"></div>
          
          <div className="flex items-center gap-4 relative">
            <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 group-hover:scale-110 transition-transform duration-300">
              <Calendar className="h-6 w-6 text-zinc-900 dark:text-white" />
            </div>
            <div>
              <Skeleton className="h-2 w-20  rounded-md" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400 ">Latest Form</p>
              <div className="text-3xl font-bold  text-zinc-900 dark:text-white">
                <Skeleton className="h-8 w-10 rounded-md" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Forms Grid with Enhanced Retro Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <Card 
            key={index} 
            className="group relative bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-xl"
          >
            {/* Retro Accent Elements */}
            <div className="absolute top-0 left-0 h-full w-1 bg-black dark:bg-white"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform rotate-45 translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform rotate-45 -translate-x-16 translate-y-16"></div>
            
            <div className="p-6 pl-7 relative">
              {/* Icon and title with hover effect */}
              <div className="flex items-center gap-3 mb-5">
                <div className="rounded-lg p-2.5 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 group-hover:scale-110 transition-transform duration-300">
                  <FileSpreadsheet className="h-5 w-5 text-zinc-900 dark:text-white" />
                </div>
                <div className=" font-bold text-lg line-clamp-1 text-zinc-900 dark:text-white group-hover:translate-x-1 transition-transform duration-300">
                  <Skeleton className="h-[1.125rem] w-32 rounded-md" />
                </div>
              </div>
              
              {/* Form metadata with retro style */}
              <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 mb-4 ">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                <span>Created <Skeleton className="inline-block h-3 w-24 align-middle ml-1" /></span>
              </div>
              
              {/* View button area with modern hover */}
              <div className="flex items-center justify-between">
                <div className="text-xs  bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-3 py-1 rounded-full border-2 border-zinc-200 dark:border-zinc-700 group-hover:scale-105 transition-transform duration-300">
                  <Skeleton className="inline-block h-3 w-8 align-middle mr-1" />responses
                </div>
                
                <div className="inline-flex items-center gap-1 text-sm  font-bold text-zinc-900 dark:text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                  VIEW FORM
                  <ArrowRight className="h-4 w-4 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            {/* Bottom hover indicator with retro style */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black dark:bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
          </Card>
        ))}
      </div>
    </div>
  );
} 