import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Container } from "./container"
import { Sparkles } from "lucide-react"

export default function Faq() {
  const faqData = [
    {
      question: "What is Mantlz?",
      answer:
        "Mantlz is a powerful platform that helps you create, customize, and manage forms for your business or personal needs with ease and efficiency.",
    },
    {
      question: "How can Mantlz help my business?",
      answer:
        "Mantlz simplifies the form creation process, helps you collect and organize data efficiently, integrate with your existing workflows, and gain valuable insights from form submissions.",
    },
    {
      question: "Is there a free plan available?",
      answer:
        "Yes, Mantlz offers a free tier that includes essential form features. For advanced functionality, check our pricing page for premium plan options.",
    },
    {
      question: "How secure is the data collected through Mantlz forms?",
      answer:
        "Mantlz employs industry-standard security measures to protect your data. All form submissions are encrypted, and we comply with data protection regulations to ensure your information remains safe.",
    },
    {
      question: "Can I customize the look and feel of my forms?",
      answer:
        "Absolutely! Mantlz provides extensive customization options, allowing you to match forms to your brand identity with custom colors, logos, fonts, and layouts.",
    },
    {
      question: "Can I integrate Mantlz forms with other tools I use?",
      answer:
        "Yes, Mantlz seamlessly integrates with popular tools like Google Sheets, Slack, Zapier, and many CRM systems to fit into your existing workflow.",
    },
  ]

  return (
    <section 
      className="py-24 relative"
      id="faq"
    >
      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left gap-8">
          <div className="lg:w-1/3">
            <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>FAQ</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Everything you need to know about Mantlz and our form management platform
            </p>
          </div>
          <div className="lg:w-2/3 w-full">
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-2 border-black dark:border-zinc-600 rounded-lg overflow-hidden transform-gpu translate-y-[-2px] translate-x-[-2px] hover:translate-y-[-4px] hover:translate-x-[-4px] transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]"
                >
                  <AccordionTrigger 
                    className="px-5 py-4 text-left font-bold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-all group"
                  >
                    <span className="group-hover:text-white dark:group-hover:text-white transition-colors">
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 py-4 text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 border-t-2 border-black dark:border-zinc-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Container>
    </section>
  )
}

