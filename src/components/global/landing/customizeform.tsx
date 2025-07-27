import { Card, CardContent } from '@/components/ui/card'
import { Smartphone, Laptop } from 'lucide-react'

export default function CustomizeFormSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Customise forms to your needs</h1>
                    <p className="mt-4 text-lg md:text-xl text-muted-foreground">Easily design and personalise forms to fit your brand&lsquo;s identity and look great on any device.</p>
                </div>
                <div className="relative">
                    <Card className="relative overflow-hidden mb-12 border-amber-600">
                        <CardContent className="pt-6 px-6 py-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h3 className="text-2xl font-semibold mb-4">Design once, use everywhere</h3>
                                    <p className="text-muted-foreground mb-6">Create beautiful form templates that maintain your brand consistency across all customer touchpoints.</p>
                                    <ul className="space-y-2">
                                        {[
                                            "Drag-and-drop field reordering",
                                            "Pre-built form types for quick starts",
                                            "Customizable field properties",
                                            "Professional form styling"
                                        ].map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <div className="bg-primary/10 text-primary rounded-full p-1">
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 5L6.5 10.5L4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-muted/30 rounded-lg p-4 border border-dashed">
                                    <div className="aspect-video rounded-md bg-background border overflow-hidden relative">
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
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <Card className="relative overflow-hidden border-amber-600">
            <CardContent className="pt-6">
                <div className="relative mx-auto flex aspect-square size-16 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                    {icon}
                </div>
                <div className="relative z-10 mt-6 space-y-2 text-center">
                    <h2 className="text-lg font-medium transition">{title}</h2>
                    <p className="text-foreground">{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}