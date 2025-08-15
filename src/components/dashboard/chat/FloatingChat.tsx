"use client"

import { useState } from "react"
import Image from "next/image"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ChatInterface } from "./ChatInterface"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 z-50 p-0"
            onClick={() => setIsOpen(true)}
          >
            <Image
              src="/logo.png"
              alt="Chat with AI"
              width={32}
              height={32}
              className="rounded-full"
            />
          </Button>
        </SheetTrigger>
        
        <SheetContent 
          side="left" 
          className="w-[400px] sm:w-[500px] p-0 border-r border-zinc-200 dark:border-zinc-800"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="AI Assistant"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <div>
                  <SheetTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI Assistant
                  </SheetTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ask about your forms and data
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Chat Interface */}
            <div className="flex-1 overflow-hidden">
              <ChatInterface />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}