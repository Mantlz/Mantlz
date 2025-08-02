"use client"

import React, { useState, useEffect} from 'react'
import { useRouter } from 'next/navigation'
import { IconSearch, IconLayoutGrid, IconListDetails } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormBuilderHeader } from "@/components/form-builder/form-builder-header"
import { FormTemplateCard } from "@/components/form-builder/form-template-card"
import { FormTemplateListItem } from "@/components/form-builder/form-template-list-item"
import { categories, formTemplates } from "@/lib/constants/form-builder"
import { Button } from '@/components/ui/button'
import { ViewMode } from "@/types/form-builder"
import { cn } from '@/lib/utils'




export default function FormBuilderPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredForms, setFilteredForms] = useState(formTemplates)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Filter forms based on active category and search query
  useEffect(() => {
    const filtered = formTemplates.filter(form => {
      const matchesCategory = activeCategory === "all" || form.category === activeCategory
      const matchesSearch = form.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           form.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    setFilteredForms(filtered)
  }, [activeCategory, searchQuery])

  const handleContinue = () => {
    if (selectedType) {
      router.push(`/dashboard/form/customize?type=${selectedType}`)
    }
  }

  return (
    <div className="min-h-screen">
      <FormBuilderHeader 
        onBack={() => router.push('/dashboard')}
        onContinue={handleContinue}
        canContinue={!!selectedType}
      />

      {/* Main content */}
      <div className="w-full max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white tracking-tight mb-3">
            Choose a template
          </h2>
          <p className="text-base text-neutral-500 dark:text-neutral-400">
            Start with a pre-built template or customize from scratch
          </p>
        </div>

        {/* Filters and search */}
        <div className="mb-6 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-auto max-w-md">
              <IconSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <Input
                placeholder="Search templates..."
                className="pl-12 h-11  border border-neutral-200 dark:border-zinc-800 rounded-lg w-full sm:w-96 focus-visible:ring-primary/20 focus-visible:ring-offset-0 text-base cursor-text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 w-full justify-between sm:justify-end sm:w-auto">
              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 gap-1 flex items-center">
                    <Button
                      variant="outline"
                      onClick={() => setViewMode("grid")}
                      className={`p-1 rounded-lg ${
                        viewMode === "grid"
                          ? "bg-zinc-100 dark:bg-zinc-700 text-gray-900 dark:text-white "
                          : "text-zinc-600 dark:text-zinc-300 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                      aria-label="Grid view"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="7" height="7" x="3" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="14" rx="1" />
                        <rect width="7" height="7" x="3" y="14" rx="1" />
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setViewMode("list")}
                      className={`p-1 rounded-lg ${
                        viewMode === "list"
                          ? "bg-zinc-100 dark:bg-zinc-700 text-gray-900 dark:text-white"
                          : "text-zinc-600 dark:text-zinc-300 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                      aria-label="List view"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="3" x2="21" y1="6" y2="6" />
                        <line x1="3" x2="21" y1="12" y2="12" />
                        <line x1="3" x2="21" y1="18" y2="18" />
                      </svg>
                    </Button>
                  </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto pb-2 -mx-2 px-2">
            <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full min-w-[480px]">
              <TabsList className="bg-background dark:bg-background p-1 h-auto flex space-x-2 overflow-x-auto border border-neutral-200 dark:border-zinc-800 rounded-lg">
                {categories.map(category => {
                  const Icon = category.icon;
                  return ( 
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-sm transition-all duration-150 cursor-pointer whitespace-nowrap",
                        "data-[state=active]:bg-accent dark:data-[state=active]:bg-accent",
                        "data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white",
                        "data-[state=inactive]:text-neutral-500 dark:data-[state=inactive]:text-neutral-400",
                        "data-[state=inactive]:hover:text-neutral-700 dark:data-[state=inactive]:hover:text-neutral-300",
                        "font-medium rounded-lg"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {category.name}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {filteredForms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-background dark:bg-background rounded-lg border border-neutral-200 dark:border-zinc-800">
            <IconSearch className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mb-4" />
            <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2">No matching templates</h3>
            <p className="text-base text-neutral-500 dark:text-neutral-400 max-w-md px-6">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6 mb-8">
                {filteredForms.map((template) => (
                  <FormTemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedType === template.id}
                    onSelect={() => setSelectedType(template.id)}
                    onContinue={handleContinue}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-neutral-200 dark:border-zinc-800 overflow-hidden mb-8 divide-y divide-neutral-200 dark:divide-zinc-800">
                {filteredForms.map((template) => (
                  <FormTemplateListItem
                    key={template.id}
                    template={template}
                    isSelected={selectedType === template.id}
                    onSelect={() => setSelectedType(template.id)}
                    onContinue={handleContinue}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 