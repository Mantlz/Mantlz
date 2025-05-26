import { Container } from "./container"
// import { Sparkles } from "lucide-react"

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
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-16 mt-4 p-8 rounded-lg border-2 border-black dark:border-zinc-600 bg-white dark:bg-zinc-900 transform-gpu translate-y-[-4px] translate-x-[-4px] hover:translate-y-[-8px] hover:translate-x-[-8px] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)]">
            {companies.map((company) => (
              <div
                key={company}
                className="group px-4 py-2 rounded-lg border-2 border-black dark:border-zinc-600 transform-gpu translate-y-[-2px] translate-x-[-2px] hover:translate-y-[-4px] hover:translate-x-[-4px] transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] bg-white dark:bg-zinc-900"
              >
                <span className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white transition-all duration-300 group-hover:text-orange-500 dark:group-hover:text-orange-400">
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

