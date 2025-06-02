import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'

export default function HeroSection() {
  const isMobile = useIsMobile()
  return (
    <div className="relative isolate pt-14">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">


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
                className="rounded-md  shadow-2xl shadow-orange-700 ring-1 ring-zinc-900/10 dark:ring-white/10"
              />
            </div>
          </div>
        </div>}
      </div>

      {/* <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-orange-900 to-orange-900 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
        
      </div> */}
    </div>
  )
}
