import { Heading } from "@/components/global/heading"
import { LoadingSpinner } from "@/components/global/loading-spinner"
import { useEffect, useState } from "react"

interface SyncMessageProps {
  title: string
  message: string
  syncStatus?: boolean
  syncTime?: number
}

export function SyncMessage({ title, message, syncStatus, syncTime = 0 }: SyncMessageProps) {
  const [progress, setProgress] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState("calculating...")
  
  useEffect(() => {
    if (syncStatus) {
      setProgress(100)
      setEstimatedTime("completed")
      return
    }
    
    // Update progress based on syncTime
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (syncTime * 10))
        return Math.min(newProgress, 99) // Cap at 99% until sync is complete
      })
    }, 100)
    
    // Update estimated time
    const timeInterval = setInterval(() => {
      setEstimatedTime(prev => {
        if (prev === "calculating...") return "~15s"
        
        const seconds = parseInt(prev.replace(/[^0-9]/g, ""))
        if (isNaN(seconds) || seconds <= 1) return "almost done..."
        return `~${seconds - 1}s`
      })
    }, 1000)
    
    return () => {
      clearInterval(interval)
      clearInterval(timeInterval)
    }
  }, [syncStatus, syncTime])
  
  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center gap-7 max-w-md w-full p-8 rounded-lg bg-zinc-800 shadow-xl backdrop-blur-sm">
        {/* Simple title */}
        <Heading className="text-2xl sm:text-3xl font-semibold text-white text-center">
          {title}
        </Heading>

        {/* Message text */}
        <p className="text-sm sm:text-base text-white/80 text-center">
          {message}
        </p>

        {/* Modern progress bar */}
        <div className="w-full">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center mt-3 text-xs text-white/70">
            <span>{progress.toFixed(0)}%</span>
            <span>{syncStatus ? "Completed" : estimatedTime}</span>
          </div>
        </div>

        {/* Status and spinner in one row */}
        <div className="flex items-center gap-3 mt-2 py-2.5 px-4 rounded-full bg-white/5 backdrop-blur-sm">
          <div className={`w-2.5 h-2.5 rounded-full ${
            syncStatus ? 'bg-green-400' : 'bg-indigo-400 animate-pulse'
          }`} />
          <span className="text-sm text-white">
            {syncStatus ? 'Sync complete' : 'Syncing your workspace'}
          </span>
          
          <div className="ml-2">
            {syncStatus ? (
              <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <LoadingSpinner 
                size="sm" 
                className="w-5 h-5 text-indigo-400" 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 