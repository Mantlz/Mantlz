import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface FormSettingsProps {
  name: string
  description?: string | null
  onUpdate?: (data: { name: string; description: string }) => void
}

export function FormSettings({ name, description, onUpdate }: FormSettingsProps) {
  const [formName, setFormName] = useState(name || "")
  const [formDescription, setFormDescription] = useState(description || "")
  const [isSaving, setIsSaving] = useState(false)

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

  return (
    <Card className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-sm">
      <h3 className="text-xl font-mono font-bold mb-5 text-gray-800 dark:text-gray-200">Form Settings</h3>
      
      <div className="space-y-6">
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
        
        <div className="flex justify-end gap-3 pt-2">
          <Button 
            variant="outline" 
            className="font-mono text-gray-700 dark:text-gray-300 border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            CANCEL
          </Button>
          <Button 
            disabled={isSaving}
            className="font-mono bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white"
            onClick={handleSave}
          >
            {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
          </Button>
        </div>
      </div>
    </Card>
  )
} 