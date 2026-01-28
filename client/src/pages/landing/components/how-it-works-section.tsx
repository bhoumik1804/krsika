import { howItWorksData } from '../data'

export function HowItWorksSection() {
    return (
        <section id='how-it-works' className='bg-background py-24'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Section Header */}
                <div className='mx-auto mb-16 max-w-3xl text-center'>
                    <span className='text-sm font-semibold tracking-wider text-primary uppercase'>
                        {howItWorksData.badge}
                    </span>
                    <h2 className='mt-4 mb-6 text-3xl font-bold text-foreground sm:text-4xl'>
                        {howItWorksData.title}
                    </h2>
                    <p className='text-lg text-muted-foreground'>
                        {howItWorksData.description}
                    </p>
                </div>

                {/* Steps */}
                <div className='mx-auto max-w-5xl'>
                    <div className='relative'>
                        {/* Connection Line - Desktop */}
                        <div className='absolute top-24 right-[10%] left-[10%] hidden h-0.5 bg-border lg:block' />

                        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
                            {howItWorksData.steps.map((step) => {
                                const Icon = step.icon
                                return (
                                    <div
                                        key={step.number}
                                        className='relative flex flex-col items-center text-center'
                                    >
                                        {/* Step Number & Icon */}
                                        <div className='relative mb-6'>
                                            <div className='flex h-20 w-20 items-center justify-center rounded-full border-4 border-background bg-primary/10 ring-4 ring-primary/20'>
                                                <Icon className='h-8 w-8 text-primary' />
                                            </div>
                                            <div className='absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground'>
                                                {step.number}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className='mb-2 text-lg font-semibold text-foreground'>
                                            {step.title}
                                        </h3>

                                        {/* Description */}
                                        <p className='text-sm leading-relaxed text-muted-foreground'>
                                            {step.description}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
