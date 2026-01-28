import { Card, CardContent } from '@/components/ui/card'
import { featuresData } from '../data'

export function FeaturesSection() {
    return (
        <section id='features' className='bg-muted/30 py-24'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Section Header */}
                <div className='mx-auto mb-16 max-w-3xl text-center'>
                    <span className='text-sm font-semibold tracking-wider text-primary uppercase'>
                        {featuresData.badge}
                    </span>
                    <h2 className='mt-4 mb-6 text-3xl font-bold text-foreground sm:text-4xl'>
                        {featuresData.title}
                    </h2>
                    <p className='text-lg text-muted-foreground'>
                        {featuresData.description}
                    </p>
                </div>

                {/* Features Grid */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                    {featuresData.items.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <Card
                                key={feature.title}
                                className='group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg'
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <CardContent className='p-6'>
                                    {/* Icon */}
                                    <div
                                        className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted transition-transform duration-300 group-hover:scale-110`}
                                    >
                                        <Icon
                                            className={`h-6 w-6 ${feature.color}`}
                                        />
                                    </div>

                                    {/* Title */}
                                    <h3 className='mb-2 text-lg font-semibold text-foreground'>
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className='text-sm leading-relaxed text-muted-foreground'>
                                        {feature.description}
                                    </p>
                                </CardContent>

                                {/* Hover Gradient */}
                                <div className='pointer-events-none absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
