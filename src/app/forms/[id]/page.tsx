"use client"
import { useState } from "react"
import { useParams } from "next/navigation"

export default function PublicFormPage() {
  const params = useParams()
  const formId = params.id as string
  
  // For testing only - would be replaced with actual data from API
  const mockForm = {
    name: "Test Form",
    description: "This is a test form while we fix the API",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "feedback", label: "Feedback", type: "textarea", required: false }
    ]
  }
  
  const [formData, setFormData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate submission - replace with actual API call when working
    setTimeout(() => {
      console.log("Form data submitted:", formData)
      setSubmitSuccess(true)
      setIsSubmitting(false)
    }, 1000)
  }
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-10">
        <div className="text-center bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Thank you!</h1>
          <p className="mb-6">Your response has been submitted successfully.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md"
          >
            Submit another response
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
      <div className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2">{mockForm.name}</h1>
        {mockForm.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-6">{mockForm.description}</p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {mockForm.fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="block text-sm font-medium">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'text' && (
                <input
                  type="text"
                  className="w-full p-2 border rounded-md dark:bg-zinc-700 dark:border-zinc-600"
                  required={field.required}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                />
              )}
              {field.type === 'email' && (
                <input
                  type="email"
                  className="w-full p-2 border rounded-md dark:bg-zinc-700 dark:border-zinc-600"
                  required={field.required}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                />
              )}
              {field.type === 'textarea' && (
                <textarea
                  className="w-full p-2 border rounded-md dark:bg-zinc-700 dark:border-zinc-600"
                  required={field.required}
                  rows={4}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                />
              )}
            </div>
          ))}
          
          <button 
            type="submit"
            className="w-full px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  )
} 