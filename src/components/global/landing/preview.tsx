import Image from 'next/image';

export function DashboardPreview() {
    return (
      <div className="relative  rounded-sm shadow-emerald-600 p-2 max-w-6xl mx-auto transform hover:-translate-y-1 transition-transform duration-300">
        <div className="aspect-[16/9]  relative overflow-hidden rounded-sm">
          <Image
            src="/preview1.png"
            alt="Compliance dashboard preview"
            className="object-cover"
            fill
            priority
          />
        </div>
      </div>
    )
  }
  