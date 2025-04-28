import Image from "next/image"
import { Container } from "./container"

const TrustedCompanies = () => {
  return (
    <section className="w-full py-12 bg-white dark:bg-zinc-950">
      <Container>
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 tracking-wide">
            Powered by trusted software
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="p-3 border-2 border-neutral-200 dark:border-zinc-800 rounded-sm bg-[#fffdf7] dark:bg-zinc-950 transition-all hover:border-neutral-400 dark:hover:border-neutral-600"
              >
                <Image
                  src={`/logo-dark.svg`}
                  alt={`Company logo ${i}`}
                  width={120}
                  height={60}
                  className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default TrustedCompanies

