import Image from 'next/image';

export function DashboardPreview() {
  return (
    <div className="relative p-4 max-w-6xl mx-auto transform hover:-translate-y-1 transition-all duration-300 group">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-200/30 via-zinc-300/20 to-zinc-200/30 dark:from-zinc-800/30 dark:via-zinc-700/20 dark:to-zinc-800/30 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
      
      {/* Image container with shadow and border */}
      <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm">
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
          
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </div>
  )
}
  