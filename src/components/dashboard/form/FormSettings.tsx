import React, { useState } from 'react';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

interface FormSettingsProps {
  name: string;
  description?: string;
  onUpdate: (data: { name: string; description: string }) => void;
}

export function FormSettings({ name, description = '', onUpdate }: FormSettingsProps) {
  const [formName, setFormName] = useState(name);
  const [formDescription, setFormDescription] = useState(description);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onUpdate({ name: formName, description: formDescription });
      setIsSubmitting(false);
    }, 800);
  };

  const togglePublished = () => {
    setIsPublished(!isPublished);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Form Settings</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="formName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Form Name
            </label>
            <input
              id="formName"
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-gray-400 dark:focus:ring-zinc-600 focus:border-gray-400 dark:focus:border-zinc-600"
              placeholder="Enter form name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="formDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="formDescription"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              rows={4}
              className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-gray-400 dark:focus:ring-zinc-600 focus:border-gray-400 dark:focus:border-zinc-600"
              placeholder="Enter form description (optional)"
            />
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>

      <div className="mt-12 pt-6 border-t border-gray-100 dark:border-zinc-800">
        <div className="flex items-center justify-between pb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Danger Zone</h3>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">Delete Form</h4>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            Once you delete a form, there is no going back. All form submissions will be permanently deleted.
          </p>
          <button className="px-4 py-2 bg-white dark:bg-zinc-900 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium rounded-lg transition-colors">
            Delete Form
          </button>
        </div>
      </div>
    </div>
  );
} 