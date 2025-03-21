import { Heading } from "@/components/global/heading"
import { LoadingSpinner } from "@/components/global/loading-spinner"
import { BackgroundPattern } from "@/components/global/background-pattern"

interface SyncMessageProps {
  title: string
  message: string
  syncStatus?: boolean
}

export function SyncMessage({ title, message, syncStatus }: SyncMessageProps) {
  return (
    <div className="flex w-full flex-1 items-center justify-center p-4 xs:p-6 sm:p-8 min-h-screen bg-gray-50/50">
      <BackgroundPattern className="absolute inset-0" />
      
      <div className="relative z-10 flex -translate-y-1/2 flex-col items-center 
        gap-8 xs:gap-10 sm:gap-12 
        w-full max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%]">
        
        {/* Clean modern title */}
        <Heading className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold 
          bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent
          text-center tracking-tight">
          {title}
        </Heading>

        {/* Message text */}
        <p className="text-sm xs:text-base sm:text-lg text-gray-600 text-center font-medium">
          {message}
        </p>

        {/* Enhanced loading spinner section */}
        <div className="flex flex-col items-center gap-7">
          <div className="relative p-1">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 
              opacity-10 blur-md animate-pulse" />
            
            {/* Clean background */}
            <div className="absolute inset-[2px] rounded-full bg-white shadow-inner" />
            
            {/* Modern spinner */}
            <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 
              rounded-full p-4 xs:p-5 sm:p-6 shadow-lg shadow-gray-500/20">
              <LoadingSpinner 
                size="md" 
                className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 text-gray-100" 
              />
            </div>
          </div>

          {/* Clean status indicators */}
          {process.env.NODE_ENV === 'development' && (
            <div className="flex flex-col xs:flex-row items-center gap-3 xs:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full 
                bg-white/80 backdrop-blur-sm
                shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]
                border border-gray-200">
                <div className={`w-2 h-2 rounded-full shadow-sm ${
                  syncStatus 
                    ? 'bg-gradient-to-r from-green-400 to-green-500 animate-none' 
                    : 'bg-gradient-to-r from-gray-600 to-gray-700 animate-pulse'
                }`} />
                <span className={`font-medium ${
                  syncStatus 
                    ? 'text-green-700' 
                    : 'text-gray-700'
                }`}>
                  {syncStatus ? 'Synced' : 'Syncing'}
                </span>
              </div>
              {!syncStatus && (
                <div className="px-3 py-1.5 rounded-full 
                  bg-gray-100 border border-gray-200
                  text-gray-600 font-medium">
                  ~15s remaining
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 