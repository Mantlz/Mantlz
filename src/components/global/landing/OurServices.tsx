import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Settings2, Sparkles, Zap } from 'lucide-react'
import { ReactNode } from 'react'

export default function OurServices() {
    return (
        <section className="py-16 md:py-32">
            <div className="@container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <span className="text-sm font-medium text-primary">Our Services</span>
                    </div>
                    <h2 className="text-balance text-3xl sm:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 leading-tight">Form solutions for every need</h2>
                    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">Create, customize, and manage powerful forms with our intuitive platform</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    <Card className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-background to-muted/20 shadow-none hover:shadow-sm hover:border-primary/30">
                        <CardHeader className="pb-4">
                            <div className="relative flex aspect-square size-16 rounded-2xl items-center justify-center transition-all duration-300 group-hover:scale-110 bg-gradient-to-br from-muted/40 to-muted/20 ring-1 ring-muted/30 group-hover:ring-primary/40 mb-4">
                                <Zap className="size-7 text-primary transition-all duration-300" aria-hidden />
                            </div>
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">Form Builder</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-200">Powerful and intuitive form builder with customizable templates, field types, and styling options to match your brand.</p>
                        </CardContent>
                    </Card>

                    <Card className="group relative overflow-hidden rounded-2xl  border border-border/50 bg-gradient-to-b from-background to-muted/20 shadow-none hover:shadow-sm hover:border-primary/30">
                        <CardHeader className="pb-4">
                            <div className="relative flex aspect-square size-16 rounded-2xl items-center justify-center transition-all duration-300 group-hover:scale-110 bg-gradient-to-br from-muted/40 to-muted/20 ring-1 ring-muted/30 group-hover:ring-primary/40 mb-4">
                                <Settings2 className="size-7 text-primary transition-all duration-300" aria-hidden />
                            </div>
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">Campaign Management</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-200">Create and manage form campaigns with scheduling, analytics, and integrations for Standard and Pro plans.</p>
                        </CardContent>
                    </Card>

                    <Card className="group relative overflow-hidden rounded-2xl  border border-border/50 bg-gradient-to-b from-background to-muted/20 shadow-none hover:shadow-sm hover:border-primary/30">
                        <CardHeader className="pb-4">
                            <div className="relative flex aspect-square size-16 rounded-2xl items-center justify-center transition-all duration-300 group-hover:scale-110 bg-gradient-to-br from-muted/40 to-muted/20 ring-1 ring-muted/30 group-hover:ring-primary/40 mb-4">
                                <Sparkles className="size-7 text-primary transition-all duration-300" aria-hidden />
                            </div>
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">Integrations</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-200">Seamlessly connect with tools like Slack, Discord, and email services to streamline your workflow and data collection.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="relative mx-auto  size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
        />
        <div
            aria-hidden
            className="bg-radial to-background absolute inset-0 from-transparent to-75%"
        />
        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)