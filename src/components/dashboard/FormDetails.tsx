"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import Link from "next/link"
import { 
  ArrowLeft, 
  FileSpreadsheet, 
  ClipboardList, 
  Clock, 
  Settings, 
  ExternalLink,
  AlertCircle,
  Inbox,
  Share2,
  Code,
  Copy, 
  CheckCheck
} from "lucide-react"
import { client } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { CodeBlock } from "@/components/ui/code-block"

interface FormDetailsProps {
  formId: string
}

interface FormDetail {
  id: string
  name: string
  description?: string | null
  submissionCount: number
  createdAt: Date
  updatedAt: Date
}

interface Submission {
  id: string
  createdAt: Date
  data: Record<string, any>
}

export default function FormDetails({ formId }: FormDetailsProps) {
  const [activeTab, setActiveTab] = useState("responses")
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  // Fetch form details
  const { data: formData, isLoading: isLoadingForm, isError: isFormError } = useQuery({
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
  const { data: submissions, isLoading: isLoadingSubmissions, isError: isSubmissionsError } = useQuery({
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

  // Handle copy to clipboard
  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  // Function to get the form type based on form name
  const getFormType = () => {
    if (!formData?.name) return "feedbackForm";
    
    const name = formData.name.toLowerCase();
    if (name.includes("waitlist")) return "waitlistForm";
    if (name.includes("feedback")) return "feedbackForm";
    if (name.includes("contact")) return "contactForm";
    
    return "customForm";
  };

  // SDK code examples
  const installCode = `npm install @mantlz/nextjs
# or
yarn add @mantlz/nextjs
# or 
pnpm add @mantlz/nextjs`;

  const basicUsageCode = `import { ${getFormType()} } from "@mantlz/nextjs";

export default function MyPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <${getFormType()} formId="${formId}" />
    </div>
  );
}`;

  const customizationCode = `import { ${getFormType()} } from "@mantlz/nextjs";

export default function MyPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <${getFormType()}
        formId="${formId}"
        theme="dark" // 'light' or 'dark'
        customSubmitText="Join our waitlist"
        onSubmitSuccess={(data) => {
          console.log('Form submitted:', data);
          // Custom success handling
        }}
        onSubmitError={(error) => {
          console.error('Form error:', error);
          // Custom error handling
        }}
      />
    </div>
  );
}`;

  const advancedUsageCode = `import { useForm } from "@mantlz/nextjs";

export default function CustomFormComponent() {
  const { form, isLoading, error, submitForm } = useForm({
    formId: "${formId}",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      await submitForm(data);
      // Success handling
    } catch (error) {
      // Error handling
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading form</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {form.fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <label htmlFor={field.id} className="block font-medium">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            id={field.id}
            name={field.id}
            type={field.type}
            required={field.required}
            className="w-full p-2 border rounded-md"
          />
        </div>
      ))}
      
      <button 
        type="submit" 
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}`;

  if (isLoadingForm) {
    return (
      <div className="space-y-6 p-6 bg-gray-50 dark:bg-zinc-900 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/dashboard" className="hover:opacity-70 transition-opacity">
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
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
        <Button onClick={() => window.location.reload()} className="bg-black dark:bg-white text-white dark:text-black font-mono tracking-wide mr-3">Try Again</Button>
        <Link href="/dashboard" passHref>
          <Button variant="outline" className="bg-transparent font-mono">Go Back</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-zinc-900 rounded-lg">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/dashboard" className="hover:opacity-70 transition-opacity">
          <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-mono font-bold tracking-tight text-black dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            {formData?.name || "Form Details"}
          </h1>
          <p className="text-sm text-muted-foreground font-mono flex items-center mt-1">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            Created {formData?.createdAt ? format(new Date(formData.createdAt), "MMM d, yyyy") : "..."}
          </p>
        </div>
      </div>
      
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
          {isLoadingSubmissions ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : isSubmissionsError ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg">
              <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2 font-mono">Failed to load responses</h3>
              <p className="text-muted-foreground mb-4">
                There was an error fetching the form responses.
              </p>
              <Button onClick={() => window.location.reload()} className="bg-black dark:bg-white text-white dark:text-black font-mono tracking-wide">Try Again</Button>
            </div>
          ) : submissions?.submissions.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg">
              <Inbox className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2 font-mono">No responses yet</h3>
              <p className="text-muted-foreground mb-4">
                There are no responses to this form yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Render submissions */}
              {submissions?.submissions.map((submission) => (
                <Card key={submission.id} className="p-4 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-mono font-bold text-lg">Response #{submission.id.substring(0, 8)}</h3>
                      <p className="text-sm text-muted-foreground">
                        Submitted on {format(new Date(submission.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="font-mono"
                      onClick={() => {
                        // View submission details
                        console.log(submission.data)
                        // You could open a modal or navigate to a details page
                      }}
                    >
                      VIEW DETAILS
                    </Button>
                  </div>
                  
                  {/* Preview of submission data */}
                  <div className="mt-4 space-y-2">
                    {submission.data && typeof submission.data === 'object' && 
                      Object.entries(submission.data as Record<string, any>).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="flex">
                          <span className="font-mono font-medium w-1/3">{key}:</span>
                          <span className="w-2/3 truncate">{String(value)}</span>
                        </div>
                      ))}
                    {submission.data && typeof submission.data === 'object' && 
                      Object.keys(submission.data as Record<string, any>).length > 3 && (
                        <p className="text-sm text-muted-foreground italic">
                          + {Object.keys(submission.data as Record<string, any>).length - 3} more fields
                        </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="p-0 mt-0">
          <Card className="p-6 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700">
            <h3 className="text-xl font-mono font-bold mb-4">Form Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium font-mono mb-2">Form Name</label>
                <input 
                  type="text" 
                  value={formData?.name || ""} 
                  className="w-full p-2 border-2 border-gray-300 dark:border-zinc-700 bg-transparent rounded-md"
                  onChange={() => {}} // To be implemented
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium font-mono mb-2">Description</label>
                <textarea 
                  value={formData?.description || ""} 
                  className="w-full p-2 border-2 border-gray-300 dark:border-zinc-700 bg-transparent rounded-md min-h-24"
                  onChange={() => {}} // To be implemented
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" className="font-mono">CANCEL</Button>
                <Button className="font-mono bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black">SAVE CHANGES</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="sdk" className="p-0 mt-0">
          <Card className="bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700">
            <div className="p-6">
              <h3 className="text-xl font-mono font-bold mb-3">SDK Integration</h3>
              <p className="text-muted-foreground mb-6">
                Easily integrate this form into your Next.js application using the Mantlz SDK.
              </p>
              
              {/* Step 1: Installation */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-mono font-semibold">1. Installation</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-3 font-mono"
                    onClick={() => copyToClipboard(installCode, "install")}
                  >
                    {copiedItem === "install" ? (
                      <>
                        <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
                        COPIED
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                        COPY
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Install the Mantlz SDK in your Next.js project:
                </p>
                <CodeBlock
                  language="bash"
                  filename="Terminal"
                  code={installCode}
                />
              </div>
              
              {/* Step 2: Basic Usage */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-mono font-semibold">2. Basic Usage</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-3 font-mono"
                    onClick={() => copyToClipboard(basicUsageCode, "basic")}
                  >
                    {copiedItem === "basic" ? (
                      <>
                        <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
                        COPIED
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                        COPY
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Import and use the component in your page:
                </p>
                <CodeBlock
                  language="jsx"
                  filename="app/my-form/page.jsx"
                  code={basicUsageCode}
                />
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-900/30">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Note:</strong> The SDK automatically handles form rendering, submission, validation, and success/error states.
                  </p>
                </div>
              </div>
              
              {/* Step 3: Customization */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-mono font-semibold">3. Customization</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-3 font-mono"
                    onClick={() => copyToClipboard(customizationCode, "custom")}
                  >
                    {copiedItem === "custom" ? (
                      <>
                        <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
                        COPIED
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                        COPY
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Customize appearance and behavior:
                </p>
                <CodeBlock
                  language="jsx"
                  filename="app/my-custom-form/page.jsx"
                  code={customizationCode}
                />
              </div>
              
              {/* Step 4: Advanced Usage */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-mono font-semibold">4. Advanced Usage</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-3 font-mono"
                    onClick={() => copyToClipboard(advancedUsageCode, "advanced")}
                  >
                    {copiedItem === "advanced" ? (
                      <>
                        <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
                        COPIED
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                        COPY
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  For full control, use the <code className="font-mono text-xs bg-gray-100 dark:bg-zinc-700 px-1 py-0.5 rounded">useForm</code> hook:
                </p>
                <CodeBlock
                  language="jsx"
                  filename="components/CustomForm.jsx"
                  code={advancedUsageCode}
                />
              </div>
              
              {/* Available Components */}
              <div className="mt-8 pt-6 border-t-2 border-gray-200 dark:border-zinc-700">
                <h4 className="text-lg font-mono font-semibold mb-4">Available Components</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="p-4 border-2 border-gray-200 dark:border-zinc-700">
                    <h5 className="font-mono font-bold mb-1">waitlistForm</h5>
                    <p className="text-sm text-muted-foreground">Collect waitlist signups for your product.</p>
                  </Card>
                  <Card className="p-4 border-2 border-gray-200 dark:border-zinc-700">
                    <h5 className="font-mono font-bold mb-1">feedbackForm</h5>
                    <p className="text-sm text-muted-foreground">Gather user feedback and ratings.</p>
                  </Card>
                  <Card className="p-4 border-2 border-gray-200 dark:border-zinc-700">
                    <h5 className="font-mono font-bold mb-1">contactForm</h5>
                    <p className="text-sm text-muted-foreground">Allow users to send you messages.</p>
                  </Card>
                  <Card className="p-4 border-2 border-gray-200 dark:border-zinc-700">
                    <h5 className="font-mono font-bold mb-1">customForm</h5>
                    <p className="text-sm text-muted-foreground">Render any custom form schema.</p>
                  </Card>
                </div>
              </div>
              
              {/* Documentation Links */}
              <div className="mt-8 pt-6 border-t-2 border-gray-200 dark:border-zinc-700">
                <h4 className="text-lg font-mono font-semibold mb-4">Resources</h4>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-black dark:bg-white mr-2"></div>
                    <a 
                      href="https://docs.mantlz.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Full Documentation
                    </a>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-black dark:bg-white mr-2"></div>
                    <a 
                      href="https://github.com/mantlz/examples" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Example Projects
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 