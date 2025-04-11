import React, { useState } from 'react';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/ui/code-block"
// import { Copy, CheckCheck } from "lucide-react"

interface SdkDocsProps {
  formId: string
  formType: 'Form'
}

export function SdkDocs({ formId, formType }: SdkDocsProps) {
  const [activeTab, setActiveTab] = useState<'javascript' | 'react' | 'html'>('javascript');
  const [copied, setCopied] = useState(false);
  
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const javascriptCode = `
// Install the SDK:
// npm install @mantle/client-sdk
import { MantleForm } from '@mantle/client-sdk';

// Initialize form with your ID
const form = new MantleForm('${formId}');

// Submit form data
form.submit({
  email: 'user@example.com',
  name: 'John Doe',
  message: 'Hello World!'
})
.then(response => {
  console.log('Success:', response);
})
.catch(error => {
  console.error('Error:', error);
});
`.trim();

  const reactCode = `
// Install the SDK:
// npm install @mantle/react
import { useForm } from '@mantle/react';
import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    message: ''
  });
  
  const { submit, isSubmitting, error, success } = useForm('${formId}');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await submit(formData);
    if (success) {
      setFormData({ email: '', name: '', message: '' });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && <div className="text-green-600">Form submitted successfully!</div>}
      {error && <div className="text-red-600">{error}</div>}
      
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        required
      />
      
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="Message"
        required
      />
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
`.trim();

  const htmlCode = `
<!-- Include the SDK via CDN -->
<script src="https://cdn.mantle.app/forms/v1/mantle-forms.js"></script>

<form id="contactForm">
  <input type="email" name="email" placeholder="Email" required>
  <input type="text" name="name" placeholder="Name" required>
  <textarea name="message" placeholder="Message" required></textarea>
  <button type="submit">Submit</button>
</form>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      MantleForm.submit('${formId}', data)
        .then(response => {
          alert('Form submitted successfully!');
          form.reset();
        })
        .catch(error => {
          alert('Error submitting form: ' + error.message);
        });
    });
  });
</script>
`.trim();

  const getActiveCode = () => {
    switch (activeTab) {
      case 'javascript': return javascriptCode;
      case 'react': return reactCode;
      case 'html': return htmlCode;
      default: return javascriptCode;
    }
  };

  return (
    <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm">
      <div className="space-y-8 bg-white dark:bg-gray-900 p-6 rounded-md border-2 border-gray-200 dark:border-gray-800 shadow-md">
        <div className="space-y-4">   
          <h2 className="text-xl d tracking-wide text-gray-900 dark:text-white">SDK Documentation</h2>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-sm  text-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-500 dark:text-gray-400">Code Example</div>
              <Button 
                variant="ghost" 
                size="sm" 
                className=" text-xs"
                onClick={() => handleCopy(getActiveCode())}
              >
                Copy
              </Button>
            </div>
            <div className="relative">
              <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-sm border border-gray-300 dark:border-gray-700 overflow-x-auto">
                <code>{getActiveCode()}</code>
              </pre>
              <button
                className="absolute top-2 right-2 p-2 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                aria-label="Copy code"
              >
                {copied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-600 dark:text-green-400">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                    <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Tab navigation with retro styling */}
          <div className="border-b-2 border-gray-200 dark:border-gray-800">
            <div className="flex space-x-1">
              {[
                { id: 'javascript', label: 'JavaScript' },
                { id: 'react', label: 'React' },
                { id: 'html', label: 'HTML' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={` tracking-tight px-4 py-2 border-2 border-b-0 rounded-t-md ${
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
            {activeTab === "javascript" && (
              <>
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg  font-semibold text-gray-700 dark:text-gray-300">1. JavaScript</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Integrate this form into your website or application using our SDK.
                  </p>
                  <CodeBlock
                    language="javascript"
                    filename="JavaScript"
                    code={javascriptCode}
                  />
                </div>
              </>
            )}
            
            {activeTab === "react" && (
              <>
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg  font-semibold text-gray-700 dark:text-gray-300">2. React</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Integrate this form into your React application.
                  </p>
                  <CodeBlock
                    language="react"
                    filename="React"
                    code={reactCode}
                  />
                </div>
              </>
            )}
            
            {activeTab === "html" && (
              <>
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg  font-semibold text-gray-700 dark:text-gray-300">3. HTML</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Integrate this form into your HTML page.
                  </p>
                  <CodeBlock
                    language="html"
                    filename="HTML"
                    code={htmlCode}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Available Components */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200 dark:border-zinc-700">
          <h4 className="text-lg  font-semibold mb-4">Available Components</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-4 border-2 border-gray-200 dark:border-zinc-700">
              <h5 className=" font-bold mb-1">waitlistForm</h5>
              <p className="text-sm text-muted-foreground">Collect waitlist signups for your product.</p>
            </Card>
            <Card className="p-4 border-2 border-gray-200 dark:border-zinc-700">
              <h5 className=" font-bold mb-1">feedbackForm</h5>
              <p className="text-sm text-muted-foreground">Gather user feedback and ratings.</p>
            </Card>
            <Card className="p-4 border-2 border-gray-200 dark:border-zinc-700">
              <h5 className=" font-bold mb-1">contactForm</h5>
              <p className="text-sm text-muted-foreground">Allow users to send you messages.</p>
            </Card>
            <Card className="p-4 border-2 border-gray-200 dark:border-zinc-700">
              <h5 className=" font-bold mb-1">customForm</h5>
              <p className="text-sm text-muted-foreground">Render any custom form schema.</p>
            </Card>
          </div>
        </div>
        
        {/* Documentation Links */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200 dark:border-zinc-700">
          <h4 className="text-lg  font-semibold mb-4">Resources</h4>
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