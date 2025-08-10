"use client";

import { useState, useEffect } from "react";
import { X, Star, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
      },500);
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
    window.open('https://github.com/Mantlz/mantlz', '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.6
          }}
          className={cn(
            "fixed bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-1rem)] sm:w-auto max-w-sm sm:max-w-md md:max-w-lg",
            className
          )}
        >
          <motion.div
             whileHover={{ scale: 1.02, y: -2 }}
             transition={{ type: "spring", stiffness: 400, damping: 25 }}
             className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg shadow-lg border border-white/20 backdrop-blur-sm relative"
           >
             <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12">         
              
              {/* Message */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium"
              >
                <span className="whitespace-nowrap">Star us on GitHub</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                </motion.div>
              </motion.div>
              
              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Button
                  onClick={handleStarClick}
                  size="sm"
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/40 transition-all duration-200 text-xs px-2 sm:px-3 py-1 h-6 sm:h-7 ml-auto sm:ml-0"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ delay: 0.5, duration: 1, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Github className="h-3 w-3 sm:mr-1" />
                  </motion.div>
                  <span className="hidden sm:inline">GitHub</span>
                </Button>
              </motion.div>
              
            </div>
            
            {/* Close Button - Positioned outside content div */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 500 }}
              className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2"
            >
              <Button
                onClick={handleClose}
                variant="ghost"
                size="icon"
                className="h-6 w-6 sm:h-8 sm:w-8 hover:bg-white/20 rounded-lg transition-colors duration-200 group"
                aria-label="Close banner"
              >
                <motion.div
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}