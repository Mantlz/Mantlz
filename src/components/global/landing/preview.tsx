import Image from 'next/image';

export function DashboardPreview() {
    return (
      <div className="relative  p-2 max-w-7xl  mx-auto transform hover:-translate-y-1 transition-transform duration-300">
                      <div className="absolute  inset-0 -top-10 -bottom-20 -left-10 -right-10 bg-gradient-to-r from-purple-200/60 via-indigo-300/50 to-blue-200/60 dark:from-blue-800/30 dark:via-indigo-700/30 dark:to-purple-800/30  blur-3xl opacity-50"></div>
                      <div className="absolute inset-0 -top-10 -bottom-20 -left-10 -right-10 bg-gradient-to-r from-purple-200/60 via-indigo-300/50 to-blue-200/60 dark:from-blue-800/30 dark:via-indigo-700/30 dark:to-purple-800/30  blur-3xl opacity-50"></div>

                      <div className="absolute inset-0 -top-10 -bottom-20 -left-10 -right-10 bg-gradient-to-r from-purple-200/60 via-indigo-300/50 to-blue-200/60 dark:from-blue-800/30 dark:via-indigo-700/30 dark:to-purple-800/30  blur-3xl opacity-50"></div>



        <div className="aspect-[16/9]  relative overflow-hidden rounded-sm">
          <Image
            src="/preview1.png"
            alt="Compliance dashboard preview"
            className=""
            fill
            priority
          />
        </div>
      </div>
    )
  }
  