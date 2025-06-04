import { Heading } from "@/components/global/heading"
import { LoadingSpinner } from "@/components/global/loading-spinner"
import { useEffect, useState } from "react"
import { Logo } from "../global/logo"

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
    <div className="flex justify-center items-center h-full w-full">
      <div className="flex flex-col items-center gap-8 max-w-md w-full p-8 rounded-2xl bg-zinc-800  transition-all duration-300 ease-in-out">
        {/* Logo or icon (optional) */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg mb-1">
        <Logo size={32}/>

        </div> 

        {/* Title with enhanced styling */}
        <Heading className="text-3xl sm:text-4xl font-bold  text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
          {title}
        </Heading>

        {/* Message text with improved readability */}
        <p className="text-sm sm:text-base text-white/70 text-center leading-relaxed">
          {message}
        </p>

        {/* Enhanced progress bar with animation */}
        <div className="w-full space-y-3">
          <div className="h-2 w-full bg-zinc-700/30 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className={`h-full rounded-full transition-all duration-700 ease-out ${syncStatus ? 'bg-emerald-500' : 'bg-gradient-to-r from-orange-500 to-orange-600'}`}
              style={{ width: `${progress}%`, boxShadow: '0 0 10px rgba(249, 115, 22, 0.5)' }}
            />
          </div>
          
          <div className="flex justify-between items-center text-xs font-medium text-white/60">
            <span className="tabular-nums">{progress.toFixed(0)}%</span>
            <span className="tabular-nums">{syncStatus ? "Completed" : estimatedTime}</span>
          </div>
        </div>

        {/* Status indicator with improved visual feedback */}
        <div className="flex items-center gap-3 mt-1 py-3 px-5 rounded-xl bg-zinc-800/80 border border-zinc-700/30 backdrop-blur-sm w-full">
          <div className={`w-3 h-3 rounded-full ${syncStatus ? 'bg-emerald-400 animate-pulse' : 'bg-orange-500 animate-pulse'} shadow-lg shadow-orange-500/20`} />
          <span className="text-sm font-medium text-white/90">
            {syncStatus ? 'Sync complete' : 'Syncing your workspace'}
          </span>
          
          <div className="ml-auto">
            {syncStatus ? (
              <div className="w-6 h-6 rounded-full bg-emerald-400/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ) : (
              <LoadingSpinner 
                size="sm" 
                className="w-5 h-5 text-orange-500" 
              />
            )}
          </div>
        </div>

       
      </div>
    </div>
  )
}