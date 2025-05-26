import Image from 'next/image';

export function DashboardPreview() {
  return (
    <div className="relative p-4 max-w-7xl mx-auto  bg-orange-950 rounded-xl border-2 border-amber-900 transform hover:-translate-y-1 transition-all duration-300 group">



        {/* Aspect ratio container */}
        <div className="aspect-[16/9]  rounded-lg mx-auto relative bg-orange-900/80 border-2 border-amber-900 overflow-hidden">
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

  )
}
  