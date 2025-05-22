import Image from 'next/image';

export function DashboardPreview() {
  return (
    <div className="relative p-4 max-w-7xl mx-auto transform hover:-translate-y-1 transition-all duration-300 group">
      {/* Colorful orbital ring background effect */}
      <div className="absolute inset-0">
        {/* Main ring gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-300 via-orange-200 to-orange-100 rounded-full blur-[180px] opacity-30 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-orange-300 via-orange-200 to-orange-100 rounded-full blur-[180px] opacity-30 rotate-45 animate-pulse delay-75"></div>
        
        {/* Secondary orbital effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-400 via-orange-300 to-orange-100 rounded-full blur-[150px] opacity-20 -rotate-45 animate-pulse delay-150"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-orange-300 via-orange-200 to-orange-200 rounded-full blur-[150px] opacity-20 rotate-90 animate-pulse delay-300"></div>
        
        {/* Center glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/50 via-transparent to-orange-400/50 rounded-[100%] blur-[140px] scale-110"></div>
      </div>
      
      {/* Image container with orange border glow */}
      <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm bg-black/20 ring-1 ring-white/20 before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-orange-700 before:via-orange-500 before:to-orange-300 before:blur-xl before:opacity-20">
        {/* Aspect ratio container */}
        <div className="aspect-[16/9] relative overflow-hidden">
          {/* Image */}
          <Image
            src="/preview1.png"
            alt="Dashboard preview"
            className=""
            fill
            priority
          />
          
        </div>
      </div>
    </div>
  )
}
  