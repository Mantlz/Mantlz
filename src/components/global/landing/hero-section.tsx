"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function HeroSection() {
  const isMobile = useIsMobile();

  return (
    <div className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pb-32 lg:flex lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-12">
          <div className="relative">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center rounded-full bg-gradient-to-r from-orange-100 to-orange-50 px-4 py-2 text-sm font-medium text-orange-700 ring-1 ring-inset ring-orange-200/50 shadow-sm dark:from-orange-900/30 dark:to-orange-800/20 dark:text-orange-300 dark:ring-orange-700/30">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="font-semibold">SDK</span>
              <span className="mx-2 h-4 w-px bg-orange-400/30"></span>
              <span>npm install Mantlz/nextjs</span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-5xl xl:text-6xl">
              <span className="block bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 bg-clip-text text-transparent dark:from-white dark:via-zinc-100 dark:to-white">
                Professional Forms,
              </span>
              <span className="block bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent mt-2">
                Built for Developers
              </span>
            </h1>

            {/* Description */}
            <p className="mt-8 text-xl leading-8 text-zinc-600 dark:text-zinc-300 max-w-2xl">
              Mantle is a professional form builder designed specifically for
              developers. Create beautiful, functional forms with our
              drag-and-drop interface, extensive templates, and seamless
              integrations.
            </p>

            {/* Feature list */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="flex items-center gap-x-3 text-sm text-zinc-700 dark:text-zinc-300">
                <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-x-3 text-sm text-zinc-700 dark:text-zinc-300">
                <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
                <span className="font-medium">Free tier available</span>
              </div>
              <div className="flex items-center gap-x-3 text-sm text-zinc-700 dark:text-zinc-300">
                <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
                <span className="font-medium">Easy integration</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="mt-12 flex flex-col sm:flex-row items-start gap-6">
              <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white gap-x-2 group shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 rounded-2xl text-base font-semibold transform hover:scale-105">
                Get Started Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>

        {!isMobile && (
          <div className="mx-auto mt-24 flex max-w-2xl sm:mt-32 lg:mx-auto lg:mt-20 lg:max-w-none lg:flex-none lg:items-center lg:justify-center">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="relative w-[450px] h-[400px]">
                {/* Ambient lighting effects */}
                <div className="absolute -inset-20 bg-gradient-radial from-orange-500 via-orange-400 to-transparent blur-3xl" />
                <div className="absolute top-10 -left-10 w-32 h-32 bg-orange-400 rounded-full blur-3xl animate-pulse" />
                {/* <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-orange-600 rounded-full blur-3xl animate-pulse delay-1000" /> */}

                {/* Card stack */}
                <div className="relative h-full">
                  {/* Third card (bottom) */}
                  <div className="absolute inset-0 rounded-2xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm p-3 ring-1 ring-zinc-200/50 dark:ring-zinc-700/50 shadow-2xl transform rotate-[-8deg] transition-all duration-500 hover:rotate-[-6deg] hover:scale-105 z-10">
                    <div className="relative overflow-hidden rounded-xl">
                      <Image
                        src="/waitlist.png"
                        alt="Form builder interface - Analytics view"
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  </div>

                  {/* Second card (middle) */}
                  <div className="absolute top-4 left-4 right-4 bottom-4 rounded-2xl bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm p-3 ring-1 ring-zinc-200/50 dark:ring-zinc-700/50 shadow-2xl transform rotate-[-4deg] transition-all duration-500 hover:rotate-[-2deg] hover:scale-105 z-20">
                    <div className="relative overflow-hidden rounded-xl">
                      <Image
                        src="/waitlist.png"
                        alt="Form builder interface - Form editor"
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                    </div>
                  </div>

                  {/* First card (top) */}
                  <div className="absolute top-8 left-8 right-8 bottom-8 rounded-2xl bg-white dark:bg-zinc-800 backdrop-blur-sm p-3 ring-1 ring-zinc-200/50 dark:ring-zinc-700/50 shadow-2xl transform rotate-0 transition-all duration-500 hover:translate-y-[-8px] hover:shadow-3xl z-30">
                    <div className="relative overflow-hidden rounded-xl">
                      <Image
                        src="/waitlist.png"
                        alt="Form builder interface - Dashboard"
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
