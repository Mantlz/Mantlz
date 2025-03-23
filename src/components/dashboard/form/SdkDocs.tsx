import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/ui/code-block"
import { Copy, CheckCheck } from "lucide-react"

interface SdkDocsProps {
  formId: string
  formType: string
}

export function SdkDocs({ formId, formType }: SdkDocsProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("1")

  // Handle copy to clipboard
  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(item)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  const installCode = `npm install @mantlz/nextjs
# or
yarn add @mantlz/nextjs
# or 
pnpm add @mantlz/nextjs`

  const basicUsageCode = `import { ${formType} } from "@mantlz/nextjs";

export default function MyPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <${formType} formId="${formId}" />
    </div>
  );
}`

  const customizationCode = `import { ${formType} } from "@mantlz/nextjs";

export default function MyPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <${formType}
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
}`

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
}`

  const tabs = [
    { id: "1", label: "Installation" },
    { id: "2", label: "Basic Usage" },
    { id: "3", label: "Customization" },
    { id: "4", label: "Advanced Usage" },
  ]

  return (
    <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm">
      <div className="space-y-8 bg-white dark:bg-gray-900 p-6 rounded-md border-2 border-gray-200 dark:border-gray-800 shadow-md">
        <div className="space-y-4">
          <h2 className="text-xl font-mono font-bold tracking-wide text-gray-900 dark:text-white">SDK Documentation</h2>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-sm font-mono text-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-500 dark:text-gray-400">Code Example</div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="font-mono text-xs"
                onClick={() => copyToClipboard(installCode, "install")}
              >
                Copy
              </Button>
            </div>
            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-sm border border-gray-300 dark:border-gray-700 overflow-x-auto">
              {installCode}
            </pre>
          </div>
          
          {/* Tab navigation with retro styling */}
          <div className="border-b-2 border-gray-200 dark:border-gray-800">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`font-mono tracking-tight px-4 py-2 border-2 border-b-0 rounded-t-md ${
                    activeTab === tab.id
                    ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-700"
                    : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab content with retro styling */}
          <div className="bg-white dark:bg-gray-800 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-sm">
            {activeTab === "1" && (
              <>
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-mono font-semibold text-gray-700 dark:text-gray-300">1. Installation</h4>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-3 font-mono border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Install the Mantlz SDK in your Next.js project:
                  </p>
                  <CodeBlock
                    language="bash"
                    filename="Terminal"
                    code={installCode}
                  />
                </div>
              </>
            )}
            
            {activeTab === "2" && (
              <>
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-mono font-semibold text-gray-700 dark:text-gray-300">2. Basic Usage</h4>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-3 font-mono border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Import and use the component in your page:
                  </p>
                  <CodeBlock
                    language="jsx"
                    filename="app/my-form/page.jsx"
                    code={basicUsageCode}
                  />
                  <div className="mt-4 p-4 bg-gray-100 dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Note:</strong> The SDK automatically handles form rendering, submission, validation, and success/error states.
                    </p>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === "3" && (
              <>
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-mono font-semibold text-gray-700 dark:text-gray-300">3. Customization</h4>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-3 font-mono border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Customize appearance and behavior:
                  </p>
                  <CodeBlock
                    language="jsx"
                    filename="app/my-custom-form/page.jsx"
                    code={customizationCode}
                  />
                </div>
              </>
            )}
            
            {activeTab === "4" && (
              <>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-mono font-semibold text-gray-700 dark:text-gray-300">4. Advanced Usage</h4>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-3 font-mono border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    For full control, use the <code className="font-mono text-xs bg-gray-100 dark:bg-zinc-800 px-1 py-0.5 rounded">useForm</code> hook:
                  </p>
                  <CodeBlock
                    language="jsx"
                    filename="components/CustomForm.jsx"
                    code={advancedUsageCode}
                  />
                </div>
              </>
            )}
          </div>
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
  )
} 