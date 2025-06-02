import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'

export default function HeroSection() {
  const isMobile = useIsMobile()
  return (
    <div className="relative isolate pt-14">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-900 to-orange-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-600 to-orange-800 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div className="relative">
            <span className="mb-6 inline-flex items-center space-x-2 text-sm font-medium leading-6 text-orange-600">
              <span className="font-semibold">New</span>
              <span className="h-4 w-px bg-orange-600/20"></span>
              <span>Form builder for developers v1.0</span>
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400">
              Professional Forms,
              <br />
              Built for Developers
            </h1>
            <p className="mt-6 text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Mantle is a professional form builder for developers. It offers a drag-and-drop interface, various templates (waitlist, contact, feedback, survey), and seamless integration to efficiently collect data.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button className="bg-gradient-to-r from-orange-600 to-orange-800 hover:from-orange-700 hover:to-orange-900 text-white gap-x-2 group shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-2.5">
                Get Started Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <a href="#features" className="group text-sm font-semibold leading-6 text-zinc-900 dark:text-white transition-colors">
                View Features <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>

            {/* Stats Section with improved styling */}
            {/* <div className="mt-16 grid grid-cols-1 gap-y-8 sm:mt-20 sm:grid-cols-1 sm:gap-x-12 lg:grid-cols-2">
              <div className="flex gap-x-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 ring-1 ring-zinc-900/5 dark:ring-white/10 transition-colors hover:bg-orange-50/50 dark:hover:bg-orange-900/10">
                <div className="flex h-12 w-12 p-2 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="text-xl font-bold text-zinc-900 dark:text-white">5+</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Forms Templates</div>
                </div>
              </div>
              <div className="flex gap-x-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 ring-1 ring-zinc-900/5 dark:ring-white/10 transition-colors hover:bg-orange-50/50 dark:hover:bg-orange-900/10">
                <div className="flex h-12 w-12 p-2 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="text-xl font-bold text-zinc-900 dark:text-white">99.9%+</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Uptime</div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        {!isMobile && <div className="mx-auto mt-2 flex sm:mt-14 lg:ml-8 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-24">
          <div className="max-w-xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="rounded-xl bg-zinc-900/5 dark:bg-white/5 p-2 ring-1 ring-inset ring-zinc-900/10 dark:ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src="/preview1.png"
                alt="App screenshot"
                width={1216}
                height={721}
                className="rounded-md shadow-2xl ring-1 ring-zinc-900/10 dark:ring-white/10"
              />
            </div>
          </div>
        </div>}
      </div>

      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-orange-900 to-orange-400 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
      </div>
    </div>
  )
}
