import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Container } from "./container"

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
    <div
      className="w-full bg-white dark:bg-neutral-950 py-20 mt-10"
      id="faq"
    >
      <Container>
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left gap-8">
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-neutral-50 max-w-7xl">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 ">
              Everything you need to know about Mantlz and our form management platform
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
                  <AccordionTrigger className="px-4 py-3 text-left font-medium text-neutral-900 dark:text-neutral-50 transition-colors bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Container>
    </div>
  )
}

