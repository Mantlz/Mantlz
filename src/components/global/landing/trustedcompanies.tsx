import { Container } from "./container"
import { Sparkles } from "lucide-react"

const TrustedCompanies = () => {
  const companies = [
    "Clerk",
    "Stripe",
    "Uploadcare",
    "Resend",
    "Vercel",
  ]

  return (
    <section className="relative py-24 overflow-hidden">

      
      
      <Container className="relative z-10">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Header section */}
          <div className="flex flex-col items-center space-y-4">
            {/* <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 mb-2">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>Powered by the best</span>
            </div> */}
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent text-center">
              Powered by leading companies
            </h3>
          </div>
          
          {/* Company logos */}
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-16 mt-4 backdrop-blur-sm p-8 rounded-xl border border-zinc-200/30 dark:border-zinc-800/30 bg-white/20 dark:bg-zinc-900/20">
            {companies.map((company) => (
              <div
                key={company}
                className="group transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="text-xl md:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-zinc-600 to-zinc-800 dark:from-zinc-400 dark:to-zinc-200 transition-all duration-300 group-hover:from-zinc-800 group-hover:to-zinc-600 dark:group-hover:from-white dark:group-hover:to-zinc-300">
                  {company}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default TrustedCompanies

