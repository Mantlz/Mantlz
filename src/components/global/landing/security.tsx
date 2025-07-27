import { Card, CardContent } from '@/components/ui/card'
import { Shield, Lock, FileCheck } from 'lucide-react'

export default function SecuritySection() {
    return (
        <section className="py-16 md:py-32 bg-muted/5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Security, compliance and privacy</h1>
                    <p className="mt-4 text-lg md:text-xl text-muted-foreground">Have peace of mind with cloud-native infrastructure designed to keep your data safe and protected.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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