"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function HeroSection() {
  const isMobile = useIsMobile();

  return (
    <div className="relative isolate overflow-hidden min-h-screen">
      {/* Background circles/orbs effect */}

      {/* Content container */}
      <div className="relative z-10 mx-auto max-w-7xl  mt-20  text-center">
        {/* Top badge */}

        <div className=" inline-flex items-center rounded-full mb-2 bg-gradient-to-r from-zinc-100 to-zinc-50 px-4 py-2 text-sm font-light text-zinc-700 ring-1 ring-inset ring-zinc-200/50 shadow-sm dark:from-zinc-800/30 dark:to-zinc-500/20 dark:text-zinc-300 dark:ring-zinc-500/30">
          <Sparkles className="h-4 w-4 mr-2 text-black dark:text-white" />
          <span className="font-semibold text-black dark:text-white">SDK</span>
          <span className="mx-2 h-4 w-px bg-zinc-700"></span>
          <span>npm install Mantlz/nextjs</span>
        </div>

        {/* Main heading */}
        <h1 className="text-6xl  mt-4 font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-7xl">
          <span className="block text-black dark:text-white">Manage All of Your Forms</span>
          <span className="block text-orange-600 mt-2">
            In One Place Efficiently
          </span>
        </h1>

        {/* Description */}
        <p className="mt-2 text-md leading-8 text-stone-700  dark:text-zinc-200 max-w-2xl mx-auto">
          Manage your work, timelines and team notes all at once. Set and follow
          deadlines, assign tasks and keep your projects on check.
        </p>

        <div className="mt-2 item-center">
          <Button className="h-10 px-8 text-md bg-black dark:bg-white  text-primary-foreground dark:border-primary border text-sm shadow-md shadow-zinc-950/30 ring ring-inset ring-white/20 transition-[filter] duration-200 hover:brightness-125 active:brightness-95">
            Get started
          </Button>
        </div>
        <p className="mt-2">
          <span className="font-extralight text-sm text-stone-700 dark:text-white">
            No credit card required.
          </span>
        </p>

        {/* Dashboard preview */}
        <div className="mx-auto mt-8 flex justify-center items-center w-full sm:mt-14 lg:mt-10">
          <div className="w-full max-w-7xl">
            <div className="rounded-xl bg-zinc-900/5 dark:bg-white/5 p-2 ring-1 ring-inset ring-zinc-900/10 dark:ring-white/10 lg:rounded-2xl lg:p-4">
              <Image
                src="/preview1.png"
                alt="App screenshot"
                width={1216}
                height={721}
                className="w-full h-auto rounded-md shadow-xl shadow-stone-300 ring-1 ring-zinc-900/10 dark:ring-white/10"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
