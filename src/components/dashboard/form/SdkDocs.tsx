"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy, FileCode, Package, Zap, BookOpen, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface SdkDocsProps {
  formId: string
}

export function SdkDocs({ formId }: SdkDocsProps) {

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    // No need to manage state here as each CodeSnippet manages its own copy state
  }

  const installCode = `npm install @mantlz/nextjs`

  const providerCode = `import { MantlzProvider } from "@mantlz/nextjs";

export default function RootLayout({ children }) {
  return (
    <MantlzProvider apiKey={process.env.MANTLZ_KEY}>
      {children}
    </MantlzProvider>
  );
}`

  const usageCode = `import { Mantlz } from '@mantlz/nextjs'; // Or FeedbackForm, WaitlistForm

export default function MyContactPage() {
  return (
    <Mantlz
      formId={'${formId}'} // Your unique form ID
    />
  );
}`

  return (
    <div className="w-full mx-auto bg-gradient-to-br from-white to-gray-50/50 dark:from-zinc-950 dark:to-zinc-900/50 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">SDK Integration</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Get your form up and running in minutes</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>3 simple steps to integration</span>
            </div>
          </div>

          <Step 
            number={1} 
            title="Install the package" 
            icon={<Package className="h-4 w-4" />}
            description="Add the Mantlz SDK to your Next.js project"
          >
            <CodeSnippet code={installCode} onCopy={() => handleCopy(installCode)} language="bash" />
          </Step>

          <Step 
            number={2} 
            title="Configure the provider" 
            icon={<FileCode className="h-4 w-4" />}
            description="Wrap your app with the MantlzProvider in your layout"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                <span>Add this to your layout.tsx file</span>
              </div>
              <CodeSnippet code={providerCode} onCopy={() => handleCopy(providerCode)} language="tsx" />
            </div>
          </Step>

          <Step 
            number={3} 
            title="Use the form component" 
            icon={<FileCode className="h-4 w-4" />}
            description="Import and use the form component in your pages"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg border border-green-200 dark:border-green-800">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Create a page with your form component</span>
              </div>
              <CodeSnippet code={usageCode} onCopy={() => handleCopy(usageCode)} language="tsx" />
            </div>
          </Step>

          {/* Success message */}
          <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">You're all set!</h4>
                <p className="text-sm text-green-700 dark:text-green-400 mb-3">Your form is now ready to collect submissions. Check out our documentation for advanced customization options.</p>
                <Button variant="outline" size="sm" className="text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/20">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  View Full Documentation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StepProps {
  number: number
  title: string
  children: React.ReactNode
  icon?: React.ReactNode
  description?: string
}

function Step({ number, title, children, icon, description }: StepProps) {
  return (
    <div className="relative">
      {/* Connection line */}
      <div className="absolute left-4 top-12 bottom-0 w-px bg-gradient-to-b from-gray-200 to-transparent dark:from-zinc-700 dark:to-transparent"></div>
      
      <div className="space-y-3">
        <div className="flex items-start gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 text-sm font-semibold text-white shadow-sm">
            {number}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
              {icon && <span className="text-gray-400 dark:text-gray-500">{icon}</span>}
            </div>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
            )}
          </div>
        </div>
        <div className="ml-12">{children}</div>
      </div>
    </div>
  )
}

interface CodeSnippetProps {
  code: string
  onCopy: () => void
  language?: string
}

function CodeSnippet({ code, onCopy, language = "javascript" }: CodeSnippetProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    onCopy()
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="relative rounded-xl bg-gray-900 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-zinc-800 border-b border-gray-700 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-xs text-gray-400 ml-2">{language}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className={cn(
            "h-7 w-7 p-0 hover:bg-gray-700 dark:hover:bg-zinc-700",
            isCopied ? "text-green-400" : "text-gray-400 hover:text-gray-300",
          )}
        >
          {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span className="sr-only">{isCopied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      
      {/* Code content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code className="text-gray-100 dark:text-gray-200">{code}</code>
        </pre>
      </div>
      
      {/* Copy feedback */}
      {isCopied && (
        <div className="absolute top-2 right-12 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg">
          Copied!
        </div>
      )}
    </div>
  )
}
