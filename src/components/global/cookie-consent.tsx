"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Cookie, X } from "lucide-react"
import { useMediaQuery } from "@/hooks/user-media-query"
import Link from "next/link"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const { isMobile } = useMediaQuery()

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setIsVisible(true)
    } else if (consent === "rejected") {
      // Disable analytics and tracking if consent was previously rejected

    }
  }, [])

 
  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setIsVisible(false)
  }

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected")

    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50">
      <div className="bg-white dark:bg-zinc-900 border-t border-neutral-200 dark:border-zinc-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className={`flex ${isMobile ? 'flex-col' : 'items-start'} gap-3`}>
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <Cookie className="h-5 w-5 text-neutral-800 dark:text-neutral-200" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                  Cookie Consent
                </h3>
                <button
                  onClick={handleReject}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking &ldquo;Accept All&rdquo;, you consent to our use of cookies.{" "}
                <Link href="/gdpr" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Learn more
                </Link>
              </p>
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-2`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReject}
                  className={`${isMobile ? 'w-full' : 'flex-1'}`}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={handleAccept}
                  className={`${isMobile ? 'w-full' : 'flex-1'} bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-200 dark:hover:bg-zinc-300 text-neutral-50 dark:text-neutral-900`}
                >
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 