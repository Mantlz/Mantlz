"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Copy, FileCode, Package } from "lucide-react"
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

  const usageCode = `import { ContactForm } from '@mantlz/nextjs'; // Or FeedbackForm, WaitlistForm

export default function MyContactPage() {
  return (
    <ContactForm
      formId={'${formId}'} // Your unique form ID
      title="Contact Us"
      description="Send us a message and we'll get back to you."
      // See docs for more customization options
    />
  );
}`

  return (
    <div className="w-full  mx-auto p-2 bg-white dark:bg-zinc-950/50  shadow-sm">
      <Tabs defaultValue="quickstart" className="w-full">
        <TabsList className="w-full p-1">
          <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quickstart" className="space-y-4 p-4">
          <div className="space-y-5">
            <Step number={1} title="Install the package" icon={<Package className="h-4 w-4" />}>
              <CodeSnippet code={installCode} onCopy={() => handleCopy(installCode)} />
            </Step>

            <Step number={2} title="Add the provider" icon={<FileCode className="h-4 w-4" />}>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">In your layout.tsx:</p>
              <CodeSnippet code={providerCode} onCopy={() => handleCopy(providerCode)} />
            </Step>

            <Step number={3} title="Use the form component" icon={<FileCode className="h-4 w-4" />}>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Create a page with your form:</p>
              <CodeSnippet code={usageCode} onCopy={() => handleCopy(usageCode)} />
            </Step>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface StepProps {
  number: number
  title: string
  children: React.ReactNode
  icon?: React.ReactNode
}

function Step({ number, title, children, icon }: StepProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium dark:bg-zinc-800 dark:text-gray-300">
          {number}
        </div>
        <h3 className="font-medium flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
          {title}
          {icon && <span className="text-gray-400 dark:text-gray-500">{icon}</span>}
        </h3>
      </div>
      <div className="ml-8">{children}</div>
    </div>
  )
}

interface CodeSnippetProps {
  code: string
  onCopy: () => void
}

function CodeSnippet({ code, onCopy }: CodeSnippetProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    onCopy()
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="relative rounded-md bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className={cn(
          "absolute right-2 top-2 h-7 w-7 p-0",
          isCopied ? "text-green-500" : "text-gray-400 hover:text-gray-500 dark:hover:text-gray-300",
        )}
      >
        {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        <span className="sr-only">{isCopied ? "Copied" : "Copy"}</span>
      </Button>
      <pre className="overflow-x-auto p-4 text-sm">
        <code className="text-gray-800 dark:text-gray-200">{code}</code>
      </pre>
    </div>
  )
}
