import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Faq() {
  const faqData = [
    {
      question: "Why should I add reviews to my website?",
      answer:
        "Adding reviews to your website can increase trust, provide social proof, and help potential customers make informed decisions.",
    },
    {
      question: "Why choose YoReview to add reviews on my website?",
      answer:
        "YoReview offers easy integration, customizable widgets, and reliable service for showcasing authentic customer reviews on your website.",
    },
    {
      question: "Which reviews can I embed on my website for free?",
      answer:
        "You can embed a certain number of reviews for free with our basic plan. Check our pricing page for more details on free and paid options.",
    },
    {
      question: "How can I trust YoReview?",
      answer:
        "YoReview uses verified review collection methods and has strict policies against fake reviews to ensure authenticity and trustworthiness.",
    },
    {
      question: "How to use review widget Component Code?",
      answer:
        "We provide easy-to-use code snippets for our review widgets. Simply copy the code from your YoReview dashboard and paste it into your website's HTML.",
    },
    {
      question: "How can I embed reviews on my website?",
      answer:
        "You can embed reviews using our customizable widgets. We offer various styles and options to match your website's design.",
    },
  ]

  return (
    <div
      className="w-full bg-[#fffdf7] dark:bg-neutral-950 py-20 mt-10 px-4 sm:px-6 lg:px-8 border-t border-neutral-200 dark:border-neutral-800"
      id="faq"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left gap-8">
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-neutral-50 max-w-7xl">
              Frequent questions and answers
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 ">
              Answers to commonly asked questions about our services/packages
            </p>
          </div>
          <div className="lg:w-2/3 w-full">
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-2 border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden "
                >
                  <AccordionTrigger className="px-4 py-3 text-left font-medium text-neutral-900 dark:text-neutral-50 transition-colors bg-[#fffaf2] dark:bg-neutral-900 hover:bg-[#fff5e6] dark:hover:bg-neutral-800">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-neutral-700 dark:text-neutral-300 bg-[#fffaf2] dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}

