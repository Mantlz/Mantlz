import { Slack, Discord, Resend } from '@/components/logos'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function IntegrationsSection() {
    return (
        <section>
            <div className=" py-24 md:py-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-md [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_70%,transparent_100%)]">
                        <div className="bg-background dark:bg-muted/30 rounded-xl border dark:border-background px-6 pb-12 pt-3 shadow-2xl">
                            <Integration
                                icon={<Slack />}
                                name="Slack"
                                description="Receive form submission notifications in your Slack workspace."
                            />
                            <Integration
                                icon={<Discord />}
                                name="Discord"
                                description="Receive form submission notifications in your Discord server."
                            />
                            <Integration
                                icon={<Resend />}
                                name="Resend"
                                description="Configure email notifications for form submissions."
                            />
                        </div>
                    </div>
                    <div className="mx-auto mt-6 max-w-lg space-y-6 text-center">
                        <h2 className="text-balance text-3xl font-semibold md:text-4xl lg:text-5xl">Integrate with your favorite tools</h2>
                        <p className="text-muted-foreground">Receive notifications and stay updated with form submissions through your preferred platforms.</p>

                        <Button
                            className="h-10 px-2 text-md bg-amber-500 text-white dark:text-black dark:border-background border text-sm shadow-md shadow-zinc-950/30 ring ring-inset ring-white/20 transition-[filter] duration-200 hover:brightness-125 active:brightness-95"

                            size="sm"
                            asChild>
                            <Link href="/dashboard">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

const Integration = ({ icon, name, description }: { icon: React.ReactNode; name: string; description: string }) => {
    return (
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-dashed py-3 last:border-b-0">
            <div className="bg-muted border-foreground/5 flex size-12 items-center justify-center rounded-lg border">{icon}</div>
            <div className="space-y-0.5">
                <h3 className="text-sm font-medium">{name}</h3>
                <p className="text-muted-foreground line-clamp-1 text-sm">{description}</p>
            </div>
            <Button
                variant="outline"
                size="icon"
                aria-label="Add integration">
                <Plus className="size-4" />
            </Button>
        </div>
    )
}
