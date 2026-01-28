import { ArrowRight, Phone, Mail } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { ctaData } from '../data'

export function CtaSection() {
    return (
        <section className='relative overflow-hidden bg-linear-to-br from-primary via-primary/95 to-primary/90 py-24 text-primary-foreground'>
            {/* Background Pattern */}
            <div className='absolute inset-0 opacity-10'>
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,var(--primary-foreground)_1px,transparent_1px)] bg-size-[32px_32px]' />
            </div>

            {/* Decorative Glows */}
            <div className='absolute -top-24 -right-24 h-64 w-64 rounded-full bg-secondary/20 blur-3xl' />
            <div className='absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-secondary/20 blur-3xl' />

            <div className='relative container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='mx-auto max-w-4xl text-center'>
                    {/* Heading */}
                    <h2 className='mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl'>
                        {ctaData.heading}
                    </h2>

                    {/* Subheading */}
                    <p className='mx-auto mb-10 max-w-2xl text-lg opacity-90 sm:text-xl'>
                        {ctaData.subheading}
                    </p>

                    {/* CTA Buttons */}
                    <div className='mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row'>
                        <Button
                            size='lg'
                            variant='secondary'
                            className='group h-12 px-8 text-base'
                            asChild
                        >
                            <Link to='/sign-up'>
                                Start Free Trial
                                <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                            </Link>
                        </Button>
                        <Button
                            size='lg'
                            variant='outline'
                            className='h-12 border-2 border-primary-foreground/20 bg-transparent px-8 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground'
                            asChild
                        >
                            <a href='#demo'>Request Demo</a>
                        </Button>
                    </div>

                    {/* Contact Info */}
                    <div className='flex flex-col items-center justify-center gap-6 text-sm opacity-80 sm:flex-row'>
                        <a
                            href={ctaData.contact.phoneHref}
                            className='flex items-center gap-2 transition-opacity hover:opacity-100'
                        >
                            <Phone className='h-4 w-4' />
                            {ctaData.contact.phone}
                        </a>
                        <a
                            href={ctaData.contact.emailHref}
                            className='flex items-center gap-2 transition-opacity hover:opacity-100'
                        >
                            <Mail className='h-4 w-4' />
                            {ctaData.contact.email}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
