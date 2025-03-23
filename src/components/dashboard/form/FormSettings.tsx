import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"

interface FormSettingsProps {
  name: string
  description?: string | null
  onUpdate?: (data: { name: string; description: string }) => void
}

export function FormSettings({ name, description, onUpdate }: FormSettingsProps) {
  const [formName, setFormName] = useState(name || "")
  const [formDescription, setFormDescription] = useState(description || "")
  const [isSaving, setIsSaving] = useState(false)
  const [isPublished, setIsPublished] = useState(false)

  const handleSave = () => {
    if (onUpdate) {
      setIsSaving(true)
      // Simulate API call
      setTimeout(() => {
        onUpdate({
          name: formName,
          description: formDescription,
        })
        setIsSaving(false)
      }, 800)
    }
  }

  const togglePublished = () => {
    setIsPublished(!isPublished)
  }

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-md border-2 border-gray-200 dark:border-gray-800 shadow-md">
      <h2 className="text-xl font-mono font-bold tracking-wide text-gray-900 dark:text-white">
        Form Settings
      </h2>
      
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-mono font-medium text-gray-900 dark:text-white">Form Visibility</h3>
              <p className="text-sm font-mono text-gray-500 dark:text-gray-400">
                Control whether your form is published and accessible to users.
              </p>
            </div>
            <Switch 
              checked={isPublished}
              onCheckedChange={togglePublished}
              className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600 border-2"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-mono font-medium mb-2 text-gray-700 dark:text-gray-300">Form Name</label>
          <input 
            type="text" 
            value={formName} 
            onChange={(e) => setFormName(e.target.value)}
            className="w-full p-2.5 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400 transition-colors"
            placeholder="Enter form name..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-mono font-medium mb-2 text-gray-700 dark:text-gray-300">Description</label>
          <textarea 
            value={formDescription} 
            onChange={(e) => setFormDescription(e.target.value)}
            className="w-full p-2.5 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400 transition-colors min-h-32"
            placeholder="Describe your form's purpose..."
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 gap-4 pt-4 border-t-2 border-gray-100 dark:border-gray-800">
          <Button 
            variant="destructive" 
            className="w-full font-mono tracking-wide uppercase border-2 border-red-700 shadow-md hover:shadow-lg transition-all"
            onClick={handleSave}
          >
            Delete Form
          </Button>
        </div>
      </div>
    </div>
  )
} 