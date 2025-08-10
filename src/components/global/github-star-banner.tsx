"use client";

import { useState, useEffect } from "react";
import { X, Star, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GitHubStarBannerProps {
  className?: string;
}

export function GitHubStarBanner({ className }: GitHubStarBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if banner has been dismissed
    const isDismissed = localStorage.getItem("hide-banner") === "true";
    if (!isDismissed) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem("hide-banner", "true");
    }, 300);
  };

  const handleStarClick = () => {
    window.open("https://github.com/Mantlz/mantlz", "_blank");
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out w-[calc(100%-1rem)] sm:w-auto max-w-sm sm:max-w-md md:max-w-lg",
        isAnimating ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
        className
      )}
    >
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg shadow-lg border border-white/20 backdrop-blur-sm">
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 relative">         
          
          {/* Message */}
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
            <span className="whitespace-nowrap">Star us on GitHub</span>
            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
          </div>
          
          {/* CTA Button */}
          <Button
            onClick={handleStarClick}
            size="sm"
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/40 transition-all duration-200 text-xs px-2 sm:px-3 py-1 h-6 sm:h-7 ml-auto sm:ml-0"
          >
            <Github className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">GitHub</span>
          </Button>
          
          {/* Close Button */}
          <Button
            onClick={handleClose}
            variant="ghost"
            size="icon"
            className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 hover:bg-white/20 rounded-lg transition-colors duration-200 group"
            aria-label="Close banner"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform duration-200" />
          </Button>
        </div>
      </div>
    </div>
  );
}