import { Container } from "./container"

const TrustedCompanies = () => {
  const companies = [
    "Clerk",
    "Stripe",
    "Uploadcare",
    "Resend",
    "Vercel",
  ]

  return (
    <section className="w-full py-24">
      <Container>
        <div className="flex flex-col items-center justify-center space-y-10">
          <div className="flex flex-col items-center space-y-3">
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Powered by the best
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 text-center">
              Trusted by leading companies
            </h3>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-10 md:gap-x-20">
            {companies.map((company) => (
              <div
                key={company}
                className="group"
              >
                <span className="text-2xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-neutral-400 to-neutral-500 dark:from-neutral-500 dark:to-neutral-600 transition-all duration-300 group-hover:from-indigo-500 group-hover:to-purple-600">
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

