import Image from 'next/image';

export function DashboardPreview() {
  return (
    <div className="relative p-4 max-w-7xl mx-auto transform hover:-translate-y-1 transition-all duration-300 group">
      {/* Colorful orbital ring background effect */}
      <div className="absolute inset-0">
        {/* Main ring gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-[180px] opacity-30 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-emerald-500 via-teal-500 to-cyan-500 rounded-full blur-[180px] opacity-30 rotate-45 animate-pulse delay-75"></div>
        
        {/* Secondary orbital effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-[150px] opacity-20 -rotate-45 animate-pulse delay-150"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500 via-amber-500 to-yellow-500 rounded-full blur-[150px] opacity-20 rotate-90 animate-pulse delay-300"></div>
        
        {/* Center glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/50 via-transparent to-violet-500/50 rounded-[100%] blur-[140px] scale-110"></div>
      </div>
      
      {/* Image container with rainbow border glow */}
      <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm bg-black/20 ring-1 ring-white/20 before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-rose-500 before:via-cyan-500 before:to-emerald-500 before:blur-xl before:opacity-20">
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
          
          {/* Rainbow hover overlay */}
        </div>
      </div>
    </div>
  )
}
  