'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function Faq() {
    const faqItems = [
        {
            id: 'item-1',
            question: "What is Mantlz?",
            answer: "Mantlz is a powerful form builder platform that helps you create, customize, and manage forms for your business or personal needs with ease and efficiency.",
        },
        {
            id: 'item-2',
            question: "What plans does Mantlz offer?",
            answer: "Mantlz offers three plans: Free, Standard, and Pro. Each plan provides different form limits, submission quotas, and access to premium features like campaigns and analytics.",
        },
        {
            id: 'item-3',
            question: "What are the form limits for each plan?",
            answer: "The Free plan allows 1 form with up to 200 submissions per month. Standard plan includes 5 forms with 5,000 monthly submissions. Pro plan provides 10 forms with 10,000 monthly submissions.",
        },
        {
            id: 'item-4',
            question: "What campaign features are available?",
            answer: "Campaigns are available on Standard and Pro plans. Standard includes 3 campaigns per month with up to 500 recipients each and scheduling features. Pro offers 10 campaigns monthly with up to 10,000 recipients each, plus analytics, templates, and custom domain support.",
        },
        {
            id: 'item-5',
            question: "How can I customize my forms?",
            answer: "Mantlz provides extensive customization options through our form builder. You can create templates, add various field types, and style your forms to match your brand identity.",
        },
        {
            id: 'item-6',
            question: "Can I integrate Mantlz forms with other tools I use?",
            answer: "Yes, Mantlz seamlessly integrates with popular tools like Slack, Resend, and many CRM systems to fit into your existing workflow.",
        },
    ]

    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground mt-4 text-balance">Discover quick and comprehensive answers to common questions about our platform, services, and features.</p>
                </div>

                <div className="mx-auto mt-12 max-w-3xl">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-card ring-orange-500 w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0">
                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className="border-dashed">
                                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-base">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <p className="text-muted-foreground  justify-center text-center mt-6 px-8">
                        Can&apos;t find what you&apos;re looking for? Contact our{' '}
                        <Link
                            href="mailto:contact@mantlz.app"
                            className="text-primary font-medium hover:underline">
                            customer support team
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}