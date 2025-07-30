import { Card, CardContent } from '@/components/ui/card'
import { Smartphone, Laptop } from 'lucide-react'

export default function CustomizeFormSection() {
    return (
        <section className="py-16 md:py-32 ">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 leading-tight tracking-tight">Customise forms to your needs</h1>
                    <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">Easily design and personalise forms to fit your brand&lsquo;s identity and look great on any device.</p>
                </div>
                <div className="relative">
                    <Card className="relative overflow-hidden mb-12 rounded-2xl border border-border/50 bg-gradient-to-b from-background to-muted/20">
                        <CardContent className="pt-8 px-8 py-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-foreground">Design once, use everywhere</h3>
                                    <p className="text-muted-foreground mb-8 text-lg leading-relaxed">Create beautiful form templates that maintain your brand consistency across all customer touchpoints.</p>
                                    <ul className="space-y-2">
                                        {[
                                            "Drag-and-drop field reordering",
                                            "Pre-built form types for quick starts",
                                            "Customizable field properties",
                                            "Professional form styling"
                                        ].map((feature, index) => (
                                            <li key={index} className="flex items-center gap-3">
                                                <div className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary rounded-full p-2 ring-1 ring-primary/20">
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 5L6.5 10.5L4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                                <span className="text-foreground font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-muted/20 rounded-2xl p-6 border border-dashed border-muted/40">
                                    <div className="aspect-video rounded-xl bg-background border border-border/50 overflow-hidden relative ">
                                        <div className="absolute top-0 left-0 right-0 h-8 bg-muted/50 border-b flex items-center px-3 gap-1.5">
                                            <div className="size-2.5 rounded-full bg-red-500"></div>
                                            <div className="size-2.5 rounded-full bg-yellow-500"></div>
                                            <div className="size-2.5 rounded-full bg-green-500"></div>
                                            <div className="mx-auto text-xs text-muted-foreground">Form Builder</div>
                                        </div>
                                        <div className="pt-10 px-4 grid grid-cols-3 gap-2">
                                            {/* Left panel - Field configuration */}
                                            <div className="col-span-1 space-y-2 border-r pr-2">
                                                <div className="h-6 bg-muted/50 rounded w-full"></div>
                                                <div className="h-10 bg-muted/30 rounded border flex items-center px-2">
                                                    <div className="size-4 rounded-full bg-primary/20 mr-2"></div>
                                                    <div className="h-3 bg-muted/50 rounded w-3/4"></div>
                                                </div>
                                                <div className="h-10 bg-muted/30 rounded border flex items-center px-2">
                                                    <div className="size-4 rounded-full bg-primary/20 mr-2"></div>
                                                    <div className="h-3 bg-muted/50 rounded w-2/3"></div>
                                                </div>
                                                <div className="h-10 bg-muted/30 rounded border flex items-center px-2">
                                                    <div className="size-4 rounded-full bg-primary/20 mr-2"></div>
                                                    <div className="h-3 bg-muted/50 rounded w-1/2"></div>
                                                </div>
                                                <div className="h-10 bg-muted/30 rounded border flex items-center px-2">
                                                    <div className="size-4 rounded-full bg-primary/20 mr-2"></div>
                                                    <div className="h-3 bg-muted/50 rounded w-1/2"></div>
                                                </div>

                                            </div>
                                            
                                            {/* Middle panel - Form preview */}
                                            <div className="col-span-2 space-y-2">
                                                <div className="h-6 bg-muted/50 rounded w-3/4"></div>
                                                <div className="h-10 bg-muted/30 rounded border"></div>
                                                <div className="h-10 bg-muted/30 rounded border"></div>
                                                <div className="h-10 bg-muted/30 rounded border"></div>
                                                <div className="h-10 bg-muted/30 rounded border"></div>





                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        <CustomizationFeature 
                            icon={<Smartphone className="m-auto size-5" strokeWidth={1} />}
                            title="Mobile Responsive"
                            description="Forms automatically adapt to any screen size, ensuring a perfect experience on smartphones, tablets, and desktops."
                        />
                        <CustomizationFeature 
                            icon={<Laptop className="m-auto size-5" strokeWidth={1} />}
                            title="Multiple Field Types"
                            description="Create forms with various field types including text, email, textarea, number, checkbox, select, and file uploads with required field validation."
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

const CustomizationFeature = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
    return (
        <Card className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-background to-muted/20  transition-all duration-300 hover:shadow-xl hover:border-primary/30">
            <CardContent className="pt-8 pb-8">
                <div className="relative mx-auto flex aspect-square size-16 rounded-2xl items-center justify-center bg-gradient-to-br from-muted/40 to-muted/20 ring-1 ring-muted/30 group-hover:ring-primary/40 transition-all duration-300 mb-6">
                    <div className="text-muted-foreground group-hover:text-primary transition-colors duration-300">
                        {icon}
                    </div>
                </div>
                <div className="relative z-10 space-y-3 text-center">
                    <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{title}</h2>
                    <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-200">{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}