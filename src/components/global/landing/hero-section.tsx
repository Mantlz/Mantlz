import React from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

const stats = [
  { value: "10k+", label: "Active Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "5+", label: "Forms Templates" },
];

export default function HeroSection() {
  return (
    <>
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
          
          {/* Added subtle animated dots background */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:20px_20px] opacity-25"></div>
        </div>
        <section>
          <div className="relative pt-14 md:pt-16">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      delayChildren: 1,
                    },
                  },
                },
                item: {
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      bounce: 0.3,
                      duration: 2,
                    },
                  },
                },
              }}
              className="absolute inset-0 -z-20"
            >
              {/* Background element */}
              <div className="w-full h-full"></div>
            </AnimatedGroup>
            <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    
              
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mt-6 text-balance text-5xl font-bold tracking-tight md:text-7xl lg:mt-10 xl:text-[5.25rem]"
                >
                  Powerful Forms for Developers
                </TextEffect>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground"
                >
                  Build beautiful, responsive forms in minutes. Get analytics, custom themes, 
                  and advanced validation — all with simple API integration.
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-10 flex flex-col items-center justify-center gap-4 md:flex-row"
                >
                  <div
                    key={1}
                    className="bg-primary rounded-[calc(var(--radius-xl)+0.125rem)] p-0.5"
                  >
                    <Button
                      asChild
                      size="lg"
                      variant="default"
                      className="rounded-xl px-6 text-base font-medium shadow-lg"
                    >
                      <Link href="/dashboard">
                        <span className="text-nowrap">Start Building</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div key={2}>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-xl px-6 text-base font-medium"
                    >
                      <Link href="/examples">
                        <span className="text-nowrap">See Examples</span>
                      </Link>
                    </Button>
                  </div>
                  <div key={3} className="hidden md:block">
                    <Button
                      asChild
                      size="lg"
                      variant="ghost"
                      className="rounded-xl px-4 text-base font-medium"
                    >
                      <Link href="#demo">
                        <Play className="mr-2 h-4 w-4" />
                        <span className="text-nowrap">Watch Demo</span>
                      </Link>
                    </Button>
                  </div>
                </AnimatedGroup>
                
                {/* Added social proof stats */}
                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 1,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 grid grid-cols-3 gap-4 md:gap-8"
                >
                  {stats.map((stat, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="text-2xl font-bold md:text-3xl">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div className="relative -mr-56 mt-12 overflow-hidden px-2 sm:mr-0 sm:mt-16 md:mt-20">
                <div
                  aria-hidden
                  className="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                />
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1 transition-all hover:shadow-xl">
                  {/* Added hover effect and interactive feel to the screenshot */}
                  
                  <Image
                    className="bg-background aspect-15/8 relative hidden rounded-b-xl mt-8 dark:block"
                    src="/preview1.png"
                    alt="Form builder dashboard interface showing customizable templates and analytics"
                    width="2700"
                    height="1440"
                    priority
                  />
                  <Image
                    className="z-2 border-border/25 aspect-15/8 relative rounded-b-xl mt-8 border dark:hidden"
                    src="/preview1.png"
                    alt="Form builder dashboard interface showing customizable templates and analytics"
                    width="2700"
                    height="1440"
                    priority
                  />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
      </main>
    </>
  );
}
