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
      className="py-24 relative "
      id="faq"
    >

      
      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left gap-8">
          <div className="lg:w-1/3">
            <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>FAQ</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Everything you need to know about Mantlz and our form management platform
            </p>
          </div>
          <div className="lg:w-2/3 w-full">
            <Accordion type="single" collapsible className="space-y-3">
              {faqData.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-orange-200 dark:border-orange-800/30 rounded-lg overflow-hidden shadow-sm backdrop-blur-sm"
                >
                  <AccordionTrigger className="px-5 py-4 text-left font-medium text-zinc-800 dark:text-zinc-200 transition-colors bg-white/80 dark:bg-zinc-900/80 hover:bg-orange-50 dark:hover:bg-orange-900/20 group">
                    <span className="group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 py-4 text-zinc-600 dark:text-zinc-400 bg-white/50 dark:bg-zinc-900/50 border-t border-orange-100 dark:border-orange-800/20">
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

