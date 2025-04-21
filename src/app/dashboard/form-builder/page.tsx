"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  IconMessageCircle2, 
  IconUserPlus, 
  IconMail, 
  IconPlus, 
  IconForms, 
  IconClipboardList,
  IconSearch,
  IconBuildingStore,
  IconDeviceAnalytics,
  IconUsers,
  IconChevronRight,
  IconLayoutGrid,
  IconListDetails,
  IconArrowLeft,
  IconStar
} from "@tabler/icons-react"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Define categories
const categories = [
  { id: "all", name: "All Forms", icon: IconLayoutGrid },
  { id: "lead", name: "Lead Generation", icon: IconUserPlus },
  { id: "feedback", name: "Feedback & Support", icon: IconMessageCircle2 },
  { id: "commerce", name: "E-commerce", icon: IconBuildingStore },
  { id: "events", name: "Events & RSVP", icon: IconUsers }
]

// Define forms with categories
const allFormTypes = [
  {
    id: 'waitlist',
    name: "Waitlist Form",
    description: "Collect waitlist signups for your product",
    icon: IconUserPlus,
    category: "lead",
    popular: true
  },
  {
    id: 'contact',
    name: "Contact Form",
    description: "Simple contact form for inquiries",
    icon: IconMail,
    category: "feedback"
  },
  {
    id: 'feedback',
    name: "Feedback Form",
    description: "Collect user feedback and ratings",
    icon: IconMessageCircle2,
    category: "feedback"
  },
  {
    id: 'survey',
    name: "Survey Form",
    description: "Multiple question survey with various field types",
    icon: IconForms,
    category: "feedback",
    comingSoon: true
  },
  {
    id: 'application',
    name: "Application Form",
    description: "Detailed application form with multiple sections",
    icon: IconClipboardList,
    category: "lead",
    comingSoon: true
  },
  {
    id: 'order',
    name: "Order Form",
    description: "Simple product order form with payment integration",
    icon: IconBuildingStore,
    category: "commerce",
    comingSoon: true
  },
  {
    id: 'analytics',
    name: "Analytics Opt-in",
    description: "Get user consent for analytics tracking",
    icon: IconDeviceAnalytics,
    category: "lead",
    comingSoon: true
  },
  {
    id: 'rsvp',
    name: "RSVP Form",
    description: "Event registration with attendance confirmation",
    icon: IconUsers,
    category: "events",
    comingSoon: true
  },
  {
    id: 'custom',
    name: "Custom Form",
    description: "Build a completely custom form from scratch",
    icon: IconPlus,
    category: "all",
    comingSoon: true
  }
]

export default function FormBuilderPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredForms, setFilteredForms] = useState(allFormTypes)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter forms based on active category and search query
  useEffect(() => {
    const filtered = allFormTypes.filter(form => {
      const matchesCategory = activeCategory === "all" || form.category === activeCategory
      const matchesSearch = form.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           form.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    setFilteredForms(filtered)
  }, [activeCategory, searchQuery])

  const handleContinue = () => {
    if (selectedType) {
      router.push(`/dashboard/form-builder/customize?type=${selectedType}`)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-8 w-8 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 cursor-pointer"
                onClick={() => router.push('/dashboard')}
              >
                <IconArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-base font-medium text-neutral-900 dark:text-white">
                Create New Form
              </h1>
            </div>
            <Button 
              onClick={handleContinue}
              disabled={!selectedType}
              className={cn(
                "flex items-center gap-2 font-medium rounded-md",
                "bg-primary hover:bg-primary/90 text-white dark:text-black dark:bg-primary",
                "disabled:opacity-60 disabled:pointer-events-none transition-all duration-200",
                "text-sm px-4 h-9 cursor-pointer"
              )}
            >
              Continue
              <IconChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white tracking-tight mb-2">
            Choose a template
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Start with a pre-built template or customize from scratch
          </p>
        </div>

        {/* Filters and search */}
        <div className="mb-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-auto max-w-md">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search templates..."
                className="pl-9 h-9 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-md w-full sm:w-80 focus-visible:ring-primary/20 focus-visible:ring-offset-0 text-sm cursor-text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full justify-between sm:justify-end sm:w-auto">
              <div className="flex items-center border border-neutral-200 dark:border-zinc-800 rounded-md p-1 bg-white dark:bg-zinc-900">
                <button 
                  className={cn(
                    "p-1.5 rounded transition-all duration-150 cursor-pointer",
                    viewMode === 'grid' 
                      ? "bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white" 
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                  )}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <IconLayoutGrid className="h-4 w-4" />
                </button>
                <button 
                  className={cn(
                    "p-1.5 rounded transition-all duration-150 cursor-pointer",
                    viewMode === 'list' 
                      ? "bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white" 
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                  )}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <IconListDetails className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto pb-1 -mx-2 px-2">
            <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full min-w-[480px]">
              <TabsList className="bg-white dark:bg-zinc-900 p-1 h-auto flex space-x-1 overflow-x-auto border border-neutral-200 dark:border-zinc-800 rounded-md">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 text-sm transition-all duration-150 cursor-pointer whitespace-nowrap",
                        "data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-zinc-800",
                        "data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white",
                        "data-[state=inactive]:text-neutral-500 dark:data-[state=inactive]:text-neutral-400",
                        "data-[state=inactive]:hover:text-neutral-700 dark:data-[state=inactive]:hover:text-neutral-300",
                        "font-medium rounded-md"
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
          <div className="flex flex-col items-center justify-center py-12 text-center bg-neutral-50 dark:bg-zinc-900 rounded-lg border border-neutral-200 dark:border-zinc-800">
            <IconSearch className="h-10 w-10 text-neutral-300 dark:text-neutral-600 mb-3" />
            <h3 className="text-base font-medium text-neutral-800 dark:text-neutral-200 mb-1.5">No matching templates</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md px-6">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
                {filteredForms.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  const isComingSoon = !!type.comingSoon;
                  const isPopular = !!type.popular;
                  
                  return (
                    <div 
                      key={type.id}
                      onClick={() => !isComingSoon && setSelectedType(type.id)}
                      className={cn(
                        "relative rounded-lg overflow-hidden transition-all duration-200",
                        !isComingSoon && "cursor-pointer hover:shadow-sm hover:translate-y-[-2px]",
                        isComingSoon && "opacity-75"
                      )}
                    >
                      <Card 
                        className={cn(
                          "h-full border transition-all duration-200",
                          isSelected && !isComingSoon
                            ? 'border-primary/30 dark:border-primary/40' 
                            : '',
                          isComingSoon 
                            ? 'border-dashed border-neutral-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50'
                            : 'border-neutral-200 dark:border-zinc-800 hover:border-neutral-300 dark:hover:border-zinc-700',
                          "bg-white dark:bg-zinc-900 overflow-hidden"
                        )}
                      >
                        {isSelected && !isComingSoon && (
                          <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" />
                        )}
                        
                        <CardHeader className="p-3 pb-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className={cn(
                              "p-1.5 rounded-md shrink-0",
                              isSelected && !isComingSoon
                                ? 'bg-primary/10 text-primary' 
                                : isComingSoon
                                  ? 'bg-neutral-100 text-neutral-400 dark:bg-zinc-800 dark:text-neutral-500'
                                  : 'bg-neutral-100 text-neutral-500 dark:bg-zinc-800 dark:text-neutral-400'
                            )}>
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            
                            {isPopular && !isComingSoon && (
                              <Badge 
                                className="bg-amber-50 hover:bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 flex items-center gap-0.5 text-[9px] font-medium py-0 h-4 px-1.5"
                              >
                                <IconStar className="h-2 w-2" />
                                Popular
                              </Badge>
                            )}
                            
                            {isComingSoon && (
                              <Badge 
                                variant="outline" 
                                className="text-[9px] border-neutral-200 dark:border-zinc-800 text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-zinc-900 font-medium px-1.5 h-4"
                              >
                                Coming Soon
                              </Badge>
                            )}
                          </div>
                          
                          <div>
                            <CardTitle className={cn(
                              "text-sm font-medium mb-0.5",
                              isSelected && !isComingSoon 
                                ? 'text-primary' 
                                : isComingSoon
                                  ? 'text-neutral-600 dark:text-neutral-400'
                                  : 'text-neutral-800 dark:text-white'
                            )}>
                              {type.name}
                            </CardTitle>
                            <CardDescription className={cn(
                              "text-xs line-clamp-1",
                              isComingSoon 
                                ? "text-neutral-400 dark:text-neutral-500"
                                : "text-neutral-500 dark:text-neutral-400"
                            )}>
                              {type.description}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        
                        {!isComingSoon && (
                          <CardContent className="p-3 pt-0">
                            <Button 
                              variant={isSelected ? "default" : "outline"} 
                              size="sm" 
                              className={cn(
                                "mt-2 w-full text-xs rounded-md h-7 cursor-pointer",
                                !isSelected && "text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-zinc-800 bg-transparent hover:bg-neutral-100 dark:hover:bg-zinc-800"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isSelected) {
                                  handleContinue();
                                } else {
                                  setSelectedType(type.id);
                                }
                              }}
                            >
                              {isSelected ? "Use Template" : "Select"}
                            </Button>
                          </CardContent>
                        )}
                      </Card>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-neutral-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 mb-8 divide-y divide-neutral-200 dark:divide-zinc-800">
                {filteredForms.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  const isComingSoon = !!type.comingSoon;
                  const isPopular = !!type.popular;
                  
                  return (
                    <div 
                      key={type.id}
                      onClick={() => !isComingSoon && setSelectedType(type.id)}
                      className={cn(
                        "relative",
                        !isComingSoon && "cursor-pointer hover:bg-neutral-50 dark:hover:bg-zinc-900/50 transition-colors duration-200",
                        isComingSoon && "opacity-75",
                        isSelected && !isComingSoon && "bg-primary/5 dark:bg-primary/10"
                      )}
                    >
                      <div className="flex flex-row items-center px-4 py-3">
                        <div className="flex items-center flex-1 gap-3">
                          <div className={cn(
                            "p-2 rounded-md shrink-0",
                            isSelected && !isComingSoon
                              ? 'bg-primary/10 text-primary' 
                              : isComingSoon
                                ? 'bg-neutral-100 text-neutral-400 dark:bg-zinc-800 dark:text-neutral-500'
                                : 'bg-neutral-100 text-neutral-500 dark:bg-zinc-800 dark:text-neutral-400'
                          )}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className={cn(
                                "text-sm font-medium truncate",
                                isSelected && !isComingSoon 
                                  ? 'text-primary' 
                                  : isComingSoon
                                    ? 'text-neutral-600 dark:text-neutral-400'
                                    : 'text-neutral-800 dark:text-white'
                              )}>
                                {type.name}
                              </h3>
                              
                              {isPopular && !isComingSoon && (
                                <Badge 
                                  className="bg-amber-50 hover:bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 flex items-center gap-0.5 text-[9px] font-medium py-0 h-4 px-1.5"
                                >
                                  <IconStar className="h-2 w-2" />
                                  Popular
                                </Badge>
                              )}
                              
                              {isComingSoon && (
                                <Badge 
                                  variant="outline" 
                                  className="text-[9px] border-neutral-200 dark:border-zinc-800 text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-zinc-900 font-medium px-1.5 h-4"
                                >
                                  Coming Soon
                                </Badge>
                              )}
                            </div>
                            <p className={cn(
                              "text-xs line-clamp-1",
                              isComingSoon 
                                ? "text-neutral-400 dark:text-neutral-500"
                                : "text-neutral-500 dark:text-neutral-400"
                            )}>
                              {type.description}
                            </p>
                          </div>
                        </div>
                        {!isComingSoon && (
                          <div className="ml-auto">
                            <Button 
                              variant={isSelected ? "default" : "outline"} 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isSelected) {
                                  handleContinue();
                                } else {
                                  setSelectedType(type.id);
                                }
                              }}
                              className={cn(
                                "text-xs h-7 px-3 rounded-md cursor-pointer",
                                !isSelected && "text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-zinc-800 bg-transparent hover:bg-neutral-100 dark:hover:bg-zinc-800"
                              )}
                            >
                              {isSelected ? "Use Template" : "Select"}
                            </Button>
                          </div>
                        )}
                      </div>
                      {isSelected && !isComingSoon && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 