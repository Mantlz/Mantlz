"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {  Sparkles } from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { Meteors } from "@/components/ui/meteors";
import { Highlighter } from "@/components/ui/highlighter";

export default function HeroSection() {
  const isMobile = useIsMobile();
  return (
    <div className="relative isolate overflow-hidden min-h-screen">
      <Meteors />
      <div className="relative z-10 mx-auto max-w-8xl  mt-20  text-center">
        <div className=" inline-flex items-center rounded-xl mb-2 bg-gradient-to-r from-zinc-100 to-zinc-50 px-4 py-2 text-sm font-light text-zinc-700 ring-1 ring-inset ring-zinc-200/50 dark:from-zinc-800/30 dark:to-zinc-500/20 dark:text-zinc-500 dark:ring-zinc-500/30">
          <Sparkles className="h-4 w-4 mr-2 text-orange-500 dark:text-white" />
          <span className="font-mono text-black dark:text-white">SDK</span>
          <span className="mx-2 h-4 w-px bg-zinc-700"></span>
          <span className="text-stone-900 dark:text-stone-300">npm install Mantlz/nextjs</span>
        </div>
        <h1 className="text-4xl mt-4 font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
          <span className="block text-black dark:text-white">
            <Highlighter action="highlight" color="#fbbf24" animationDuration={800}>
              Manage All of Your Forms
            </Highlighter>
          </span>
          <span className="block text-orange-500 mt-4">
            <Highlighter action="underline" color="#f97316" animationDuration={1000}>
              In One Place Efficiently
            </Highlighter>
          </span>
        </h1>
        <p className="mt-6 text-base leading-7 text-muted-foreground max-w-2xl mx-auto">
          A modern headless form management platform with TypeScript SDK for beautiful, customizable forms.
        </p>

        <div className="mt-8 flex justify-center">
          <Link href="/dashboard">
            <Button 
                            className="h-10 px-4 text-md bg-amber-500 text-black dark:text-white dark:border-background border text-sm shadow-sm shadow-zinc-950/30 ring ring-inset ring-white/20 transition-[filter] duration-200 hover:brightness-125 active:brightness-95"

            >
              Get started
            </Button>
          </Link>
        </div>
        <p className="mt-2">
          <span className="font-extralight text-xs text-stone-700 dark:text-white">
            No credit card required.
          </span>
        </p>
        <div className="mx-auto mt-8 flex justify-center items-center w-full sm:mt-14 lg:mt-10">
          <div className="w-full max-w-7xl">
            <div className="rounded-xl bg-amber-500/5 dark:bg-orange-100/5 p-2 ring-2 ring-inset ring-orange-900/10 dark:ring-orange/10 lg:rounded-2xl lg:p-4">
              <Image
                src="/preview1.png"
                alt="App screenshot"
                width={1216}
                height={721}
                className="w-full h-auto rounded-md shadow-2xl shadow-orange-500 ring-1 ring-orange-500/5 dark:ring-orange/5"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
