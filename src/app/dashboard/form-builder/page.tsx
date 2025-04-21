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
        <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-1.5 xs:py-2 sm:py-2.5 md:py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 md:gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 cursor-pointer"
                onClick={() => router.push('/dashboard')}
              >
                <IconArrowLeft className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              </Button>
              <h1 className="text-xs xs:text-sm sm:text-base md:text-lg font-medium text-neutral-900 dark:text-white">
                Create New Form
              </h1>
            </div>
            <Button 
              onClick={handleContinue}
              disabled={!selectedType}
              className={cn(
                "flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2 font-medium rounded-md",
                "bg-primary hover:bg-primary/90 text-white dark:text-black dark:bg-primary",
                "disabled:opacity-60 disabled:pointer-events-none transition-all duration-200",
                "text-[10px] xs:text-xs sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 md:px-5 h-7 xs:h-8 sm:h-9 md:h-10 cursor-pointer"
              )}
              size="default"
            >
              Continue
              <IconChevronRight className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-6xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-3 xs:py-4 sm:py-6 md:py-8 lg:py-10">
        <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8 max-w-2xl">
          <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-neutral-900 dark:text-white tracking-tight mb-1 xs:mb-1.5 sm:mb-2 md:mb-3">
            Choose a template
          </h2>
          <p className="text-[10px] xs:text-xs sm:text-sm md:text-base text-neutral-500 dark:text-neutral-400">
            Start with a pre-built template or customize from scratch
          </p>
        </div>

        {/* Filters and search */}
        <div className="mb-3 xs:mb-4 sm:mb-5 md:mb-6 space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-5">
          <div className="flex flex-col xs:flex-col sm:flex-row items-start sm:items-center justify-between gap-2 xs:gap-3 sm:gap-4 md:gap-5">
            <div className="relative w-full sm:w-auto max-w-md">
              <IconSearch className="absolute left-2 xs:left-2.5 sm:left-3 md:left-3.5 top-1/2 transform -translate-y-1/2 h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-neutral-400" />
              <Input
                placeholder="Search templates..."
                className="pl-6 xs:pl-7 sm:pl-9 md:pl-11 h-7 xs:h-8 sm:h-9 md:h-10 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-md w-full sm:w-72 md:w-80 lg:w-96 focus-visible:ring-primary/20 focus-visible:ring-offset-0 text-[10px] xs:text-xs sm:text-sm md:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full justify-between sm:justify-end sm:w-auto">
              <div className="flex items-center border border-neutral-200 dark:border-zinc-800 rounded-md p-0.5 xs:p-0.5 sm:p-1 md:p-1.5 bg-white dark:bg-zinc-900">
                <button 
                  className={cn(
                    "p-0.5 xs:p-1 sm:p-1.5 md:p-2 rounded transition-all duration-150 cursor-pointer",
                    viewMode === 'grid' 
                      ? "bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white" 
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                  )}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <IconLayoutGrid className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                </button>
                <button 
                  className={cn(
                    "p-0.5 xs:p-1 sm:p-1.5 md:p-2 rounded transition-all duration-150 cursor-pointer",
                    viewMode === 'list' 
                      ? "bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white" 
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                  )}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <IconListDetails className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto pb-1 -mx-2 xs:-mx-3 px-2 xs:px-3">
            <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full min-w-[480px]">
              <TabsList className="bg-white dark:bg-zinc-900 p-0.5 xs:p-1 md:p-1.5 h-auto flex space-x-1 overflow-x-auto border border-neutral-200 dark:border-zinc-800 rounded-md">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className={cn(
                        "flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5 px-1.5 xs:px-2.5 sm:px-3 md:px-4 py-0.5 xs:py-1 sm:py-1.5 md:py-2 text-[10px] xs:text-xs sm:text-sm md:text-base transition-all duration-150 cursor-pointer whitespace-nowrap",
                        "data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-zinc-800",
                        "data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white",
                        "data-[state=inactive]:text-neutral-500 dark:data-[state=inactive]:text-neutral-400",
                        "data-[state=inactive]:hover:text-neutral-700 dark:data-[state=inactive]:hover:text-neutral-300",
                        "font-medium rounded-md"
                      )}
                    >
                      <Icon className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                      {category.name}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {filteredForms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 xs:py-8 sm:py-12 md:py-16 text-center bg-neutral-50 dark:bg-zinc-900 rounded-lg border border-neutral-200 dark:border-zinc-800">
            <IconSearch className="h-6 w-6 xs:h-8 xs:w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-neutral-300 dark:text-neutral-600 mb-1.5 xs:mb-2 sm:mb-3 md:mb-4" />
            <h3 className="text-xs xs:text-sm sm:text-base md:text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-0.5 xs:mb-1 sm:mb-1.5 md:mb-2">No matching templates</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm md:text-base text-neutral-500 dark:text-neutral-400 max-w-md px-2 xs:px-4 sm:px-6 md:px-8">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-6 xs:mb-8 sm:mb-10 md:mb-12">
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
                        !isComingSoon && "cursor-pointer group hover:-translate-y-1",
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
                          "group-hover:shadow bg-white dark:bg-zinc-900 overflow-hidden"
                        )}
                      >
                        {isSelected && !isComingSoon && (
                          <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" />
                        )}
                        
                        <CardHeader className="p-1.5 xs:p-2 sm:p-2.5 md:p-3 pb-0.5 xs:pb-0.5 sm:pb-0.5 md:pb-1">
                          <div className="flex items-start justify-between mb-0.5 xs:mb-1 sm:mb-1 md:mb-1.5">
                            <div className={cn(
                              "p-0.5 xs:p-0.5 sm:p-1 md:p-1 rounded-md shrink-0",
                              isSelected && !isComingSoon
                                ? 'bg-primary/10 text-primary' 
                                : isComingSoon
                                  ? 'bg-neutral-100 text-neutral-400 dark:bg-zinc-800 dark:text-neutral-500'
                                  : 'bg-neutral-100 text-neutral-500 dark:bg-zinc-800 dark:text-neutral-400'
                            )}>
                              <Icon className="h-2 w-2 xs:h-2.5 xs:w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" />
                            </div>
                            
                            {isPopular && !isComingSoon && (
                              <Badge 
                                className="bg-amber-50 hover:bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 flex items-center gap-0.5 text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] font-medium py-0 h-2.5 xs:h-3 sm:h-3 md:h-3.5 px-0.5 xs:px-0.5 sm:px-1 md:px-1.5"
                              >
                                <IconStar className="h-1.5 w-1.5 xs:h-1.5 xs:w-1.5 sm:h-2 sm:w-2 md:h-2 md:w-2" />
                                Popular
                              </Badge>
                            )}
                            
                            {isComingSoon && (
                              <Badge 
                                variant="outline" 
                                className="text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] border-neutral-200 dark:border-zinc-800 text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-zinc-900 font-medium px-0.5 xs:px-0.5 sm:px-1 md:px-1.5 h-2.5 xs:h-3 sm:h-3 md:h-3.5"
                              >
                                Coming Soon
                              </Badge>
                            )}
                          </div>
                          
                          <div>
                            <CardTitle className={cn(
                              "text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-medium mb-0 xs:mb-0.5 sm:mb-0.5 md:mb-0.5",
                              isSelected && !isComingSoon 
                                ? 'text-primary' 
                                : isComingSoon
                                  ? 'text-neutral-600 dark:text-neutral-400'
                                  : 'text-neutral-800 dark:text-white'
                            )}>
                              {type.name}
                            </CardTitle>
                            <CardDescription className={cn(
                              "text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs leading-none line-clamp-1",
                              isComingSoon 
                                ? "text-neutral-400 dark:text-neutral-500"
                                : "text-neutral-500 dark:text-neutral-400"
                            )}>
                              {type.description}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        
                        {!isComingSoon && (
                          <CardContent className="p-1.5 xs:p-2 sm:p-2.5 md:p-3 pt-0">
                            <Button 
                              variant={isSelected ? "default" : "outline"} 
                              size="sm" 
                              className={cn(
                                "mt-0.5 xs:mt-1 sm:mt-1 md:mt-1.5 w-full text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] rounded-md h-3.5 xs:h-4 sm:h-5 md:h-6 cursor-pointer",
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
              <div className="rounded-lg border border-neutral-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 mb-6 xs:mb-8 sm:mb-10 md:mb-12 divide-y divide-neutral-200 dark:divide-zinc-800">
                {filteredForms.map((type, index) => {
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
                      <div className="flex flex-col xs:flex-row sm:flex-row md:items-center px-3 xs:px-4 sm:px-5 md:px-6 py-3 xs:py-3.5 sm:py-4 md:py-5">
                        <div className="flex items-center flex-1 gap-2 xs:gap-3 sm:gap-4 md:gap-5">
                          <div className={cn(
                            "p-1 xs:p-1.5 sm:p-2 md:p-2.5 rounded-md shrink-0",
                            isSelected && !isComingSoon
                              ? 'bg-primary/10 text-primary' 
                              : isComingSoon
                                ? 'bg-neutral-100 text-neutral-400 dark:bg-zinc-800 dark:text-neutral-500'
                                : 'bg-neutral-100 text-neutral-500 dark:bg-zinc-800 dark:text-neutral-400'
                          )}>
                            <Icon className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-5 lg:w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5 mb-1 xs:mb-1.5 sm:mb-2 md:mb-2.5">
                              <h3 className={cn(
                                "text-[11px] xs:text-xs sm:text-sm md:text-base font-medium truncate",
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
                                  className="bg-amber-50 hover:bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 flex items-center gap-0.5 text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] font-medium py-0 h-2.5 xs:h-3.5 sm:h-4 md:h-5 px-0.5 xs:px-1 sm:px-1.5 md:px-2"
                                >
                                  <IconStar className="h-1.5 w-1.5 xs:h-2 xs:w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3" />
                                  Popular
                                </Badge>
                              )}
                              
                              {isComingSoon && (
                                <Badge 
                                  variant="outline" 
                                  className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] border-neutral-200 dark:border-zinc-800 text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-zinc-900 font-medium px-0.5 xs:px-1 sm:px-1.5 md:px-2 h-2.5 xs:h-3.5 sm:h-4 md:h-5"
                                >
                                  Coming Soon
                                </Badge>
                              )}
                            </div>
                            <p className={cn(
                              "text-[9px] xs:text-[10px] sm:text-xs md:text-sm line-clamp-1",
                              isComingSoon 
                                ? "text-neutral-400 dark:text-neutral-500"
                                : "text-neutral-500 dark:text-neutral-400"
                            )}>
                              {type.description}
                            </p>
                          </div>
                        </div>
                        {!isComingSoon && (
                          <div className="ml-0 xs:ml-auto mt-2 xs:mt-0 sm:mt-0 md:mt-0">
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
                                "text-[9px] xs:text-[10px] sm:text-xs md:text-sm h-5 xs:h-6 sm:h-7 md:h-8 px-2 xs:px-2.5 sm:px-3 md:px-4 rounded-md cursor-pointer",
                                !isSelected && "text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-zinc-800 bg-transparent hover:bg-neutral-100 dark:hover:bg-zinc-800"
                              )}
                            >
                              {isSelected ? "Use Template" : "Select"}
                            </Button>
                          </div>
                        )}
                      </div>
                      {isSelected && !isComingSoon && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 xs:w-1.5 sm:w-2 md:w-2.5 bg-primary" />
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