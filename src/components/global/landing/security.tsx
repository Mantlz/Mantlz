import { Card, CardContent } from '@/components/ui/card'
import { Shield, Lock, FileCheck } from 'lucide-react'

export default function SecuritySection() {
    return (
        <section className="py-16 md:py-32" id="security">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 leading-tight tracking-tight">Security, compliance and privacy</h1>
                    <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">Have peace of mind with cloud-native infrastructure designed to keep your data safe and protected.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
                    <ComplianceCard 
                        icon={<Shield className="m-auto size-5" strokeWidth={1} />}
                        title="End-to-end Encryption"
                        description="All data is encrypted in transit and at rest using industry-standard protocols to ensure maximum protection."
                    />
                    <ComplianceCard 
                        icon={<Lock className="m-auto size-5" strokeWidth={1} />}
                        title="SOC 2 Certified"
                        description="We maintain SOC 2 certification, demonstrating our commitment to security controls and data protection."
                    />
                    <ComplianceCard 
                        icon={<FileCheck className="m-auto size-5" strokeWidth={1} />}
                        title="GDPR Compliant"
                        description="Our platform is fully compliant with General Data Protection Regulation requirements for data privacy."
                    />
                </div>
            </div>
        </section>
    )
}

const ComplianceCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
    return (
        <Card className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-background to-muted/20 shadow-none transition-all duration-300 hover:shadow-sm hover:border-primary/30">
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