"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-background flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto py-12 sm:py-16 px-4 sm:px-10 text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 sm:mb-8 flex justify-center"
        >
          <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 dark:text-green-400" />
        </motion.div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-2 sm:mb-3 text-zinc-900 dark:text-white">
            Submission received
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-300 mb-8 sm:mb-10">
            Thank you for your submission. We&apos;ll be in touch shortly.
          </p>

          <div className="mt-6 sm:mt-8">
            <Link href="https://mantlz.com" target="_blank" rel="noopener noreferrer">
              <Button 
                className="h-10 px-4 text-md bg-amber-500 text-black dark:text-white dark:border-background border text-sm shadow-sm shadow-zinc-950/30 ring ring-inset ring-white/20 transition-[filter] duration-200 hover:brightness-125 active:brightness-95" 
                size="lg" 
              > 
                Return to website
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Powered by Mantlz */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 sm:mt-14 flex flex-col items-center justify-center"
        >
          <a href="https://mantlz.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
            <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-2">
              Powered by <span className="text-amber-500 font-extrabold">Mantlz</span>
            </span>
          </a>
        </motion.div>
      </motion.div>
    </div>
  )
}
