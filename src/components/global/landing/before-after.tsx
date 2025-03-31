import { CheckCircle2, XCircle } from "lucide-react"

export default function BeforeAfter() {
  return (
    <section className="bg-[#fffdf7] dark:bg-neutral-950 py-16 md:py-24 border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-sm bg-[#fffaf2] dark:bg-neutral-900 shadow-md border-2 border-neutral-200 dark:border-neutral-800 transition-all duration-300 hover:shadow-lg">
            <div className="p-8 sm:p-10">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 mb-4">
                <XCircle className="h-6 w-6" />
                <p className="text-lg font-bold font-mono">Before</p>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl mb-6 font-mono">
                Traditional Teaching Limitations
              </h3>
              <ul className="space-y-4 text-base text-neutral-700 dark:text-neutral-300 sm:text-lg font-mono">
                {[
                  "Forms are not customizable",
                  "Forms are not responsive",
                  "Forms are not accessible",
                  "Forms are not secure",
                  "Forms are not scalable",
                  "Forms are not easy to create",
                  "Forms are not easy to manage",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <XCircle className="h-6 w-6 flex-shrink-0 text-neutral-800 dark:text-neutral-200" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-sm bg-neutral-800 dark:bg-neutral-200 shadow-md border-2 border-neutral-700 dark:border-neutral-300 transition-all duration-300 hover:shadow-lg">
            <div className="p-8 sm:p-10">
              <div className="flex items-center gap-2 text-neutral-200 dark:text-neutral-800 mb-4">
                <CheckCircle2 className="h-6 w-6" />
                <p className="text-lg font-bold font-mono">After</p>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-neutral-50 dark:text-neutral-900 sm:text-3xl mb-6 font-mono">
                AI-Powered Teaching Assistant
              </h3>
              <ul className="space-y-4 text-base text-neutral-200 dark:text-neutral-800 sm:text-lg font-mono">
                {[
                  "Forms are customizable",
                  "Forms are responsive",
                  "Forms are accessible",
                  "Forms are secure",
                  "Forms are scalable",
                  "Forms are easy to create",
                  "Forms are easy to manage",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-neutral-200 dark:text-neutral-800" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

