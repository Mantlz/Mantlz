"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Inbox, Settings, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Import our new components
import { FormHeader } from "@/components/dashboard/form/FormHeader"
import { FormResponsesList } from "@/components/dashboard/form/FormResponsesList"
import { FormSettings } from "@/components/dashboard/form/FormSettings"
import { SdkDocs } from "@/components/dashboard/form/SdkDocs"
import { FormDetail, Submission } from "@/components/dashboard/form/types"

interface FormDetailsProps {
  formId: string
}

export default function FormDetails({ formId }: FormDetailsProps) {
  const [activeTab, setActiveTab] = useState("responses")

  // Fetch form details
  const { data: formData, isLoading: isLoadingForm, isError: isFormError, refetch: refetchForm } = useQuery({
    queryKey: ["formDetails", formId],
    queryFn: async () => {
      try {
        const response = await client.forms.getFormById.$get({
          id: formId
        })
        return response.json()
      } catch (err) {
        console.error("Error fetching form details:", err)
        throw err
      }
    }
  })

  // Fetch form submissions
  const { data: submissions, isLoading: isLoadingSubmissions, isError: isSubmissionsError, refetch: refetchSubmissions } = useQuery({
    queryKey: ["formSubmissions", formId],
    queryFn: async () => {
      try {
        const response = await client.forms.getFormSubmissions.$get({
          formId
        })
        return response.json() 
      } catch (err) {
        console.error("Error fetching form submissions:", err)
        throw err
      }
    },
    enabled: activeTab === "responses"
  })

  // Function to get the form type based on form name
  const getFormType = () => {
    if (!formData?.name) return "feedbackForm";
    
    const name = formData.name.toLowerCase();
    if (name.includes("waitlist")) return "waitlistForm";
    if (name.includes("feedback")) return "feedbackForm";
    if (name.includes("contact")) return "contactForm";
    
    return "customForm";
  };

  // Handle form update
  const handleFormUpdate = async (data: { name: string; description: string }) => {
    // Implement form update logic here
    console.log("Updating form:", data)
    // After update, refetch the form data
    // await refetchForm()
  }

  if (isLoadingForm) {
    return (
      <div className="space-y-6 p-6 bg-gray-50 dark:bg-zinc-900 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/dashboard" className="hover:opacity-70 transition-opacity">
            <Skeleton className="h-5 w-5 rounded-full" />
          </Link>
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-12 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (isFormError) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-zinc-900 rounded-lg border-2 border-gray-300 dark:border-zinc-700">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 dark:bg-zinc-800 mb-4 border-2 border-gray-300 dark:border-zinc-700">
          <AlertCircle className="h-8 w-8 text-gray-700 dark:text-gray-300" />
        </div>
        <h3 className="text-lg font-medium mb-2 font-mono">Failed to load form details</h3>
        <p className="text-muted-foreground mb-4">
          The form could not be found or you don't have permission to view it.
        </p>
        <Button onClick={() => refetchForm()} className="bg-black dark:bg-white text-white dark:text-black font-mono tracking-wide mr-3">Try Again</Button>
        <Link href="/dashboard" passHref>
          <Button variant="outline" className="bg-transparent font-mono">Go Back</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-zinc-900 rounded-lg">
      {/* Header with back button */}
      <FormHeader 
        name={formData?.name || ""} 
        createdAt={formData?.createdAt} 
      />
      
      {/* Tabs for different sections */}
      <Tabs
        defaultValue="responses"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="font-mono mb-6 bg-transparent border-b-2 border-gray-300 dark:border-zinc-700 w-full justify-start rounded-none p-0 h-auto">
          <TabsTrigger 
            value="responses" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:text-black dark:data-[state=active]:text-white py-2 px-4"
          >
            <Inbox className="h-4 w-4 mr-2" />
            RESPONSES ({formData?.submissionCount || 0})
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:text-black dark:data-[state=active]:text-white py-2 px-4"
          >
            <Settings className="h-4 w-4 mr-2" />
            SETTINGS
          </TabsTrigger>
          <TabsTrigger 
            value="sdk" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:text-black dark:data-[state=active]:text-white py-2 px-4"
          >
            <Code className="h-4 w-4 mr-2" />
            SDK
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="responses" className="p-0 mt-0">
          <FormResponsesList 
            isLoading={isLoadingSubmissions}
            isError={isSubmissionsError}
            submissions={submissions}
            onRetry={() => refetchSubmissions()}
          />
        </TabsContent>
        
        <TabsContent value="settings" className="p-0 mt-0">
          <FormSettings 
            name={formData?.name || ""}
            description={formData?.description}
            onUpdate={handleFormUpdate}
          />
        </TabsContent>
        
        <TabsContent value="sdk" className="p-0 mt-0">
          <SdkDocs 
            formId={formId}
            formType={getFormType()}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 