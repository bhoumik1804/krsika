import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { useUser } from '../hooks'
import { MillRegistrationDialog } from './mill-registration-dialog'

export function HeroSection() {
    const { isAuthenticated } = useUser()
    return (
        <section className='relative flex min-h-screen items-center justify-center overflow-hidden pt-16'>
            {/* Background Gradient */}
            <div className='absolute inset-0 bg-linear-to-br from-primary/5 via-background to-secondary/10' />

            {/* Animated Background Elements */}
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-primary/10 blur-3xl' />
                <div className='absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-chart-2/10 blur-3xl delay-1000' />
                <div className='absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-chart-1/5 blur-3xl' />
            </div>

            <div className='relative container mx-auto px-4 py-20 sm:px-6 lg:px-8'>
                <div className='mx-auto max-w-4xl text-center'>
                    {/* Badge */}
                    <div className='mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary'>
                        <Sparkles className='h-4 w-4' />
                        <span>Trusted by 500+ Rice Mills across India</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className='mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl'>
                        Modernize Your{' '}
                        <span className='relative'>
                            <span className='relative z-10 text-primary'>
                                Rice Mill
                            </span>
                            <span className='absolute bottom-2 left-0 z-0 h-3 w-full bg-primary/20' />
                        </span>{' '}
                        Operations
                    </h1>

                    {/* Subheading */}
                    <p className='mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl'>
                        The all-in-one cloud platform to manage inventory,
                        purchases, sales, and processing. Digitize your mill
                        operations and boost efficiency by 40%.
                    </p>

                    <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
                        {isAuthenticated ? (
                            <MillRegistrationDialog
                                trigger={
                                    <Button
                                        size='lg'
                                        className='group h-12 px-8 text-base'
                                    >
                                        Get Started
                                        <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                                    </Button>
                                }
                            />
                        ) : (
                            <Button
                                size='lg'
                                className='group h-12 px-8 text-base'
                                asChild
                            >
                                <Link to='/sign-up'>
                                    Get Started
                                    <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                                </Link>
                            </Button>
                        )}
                        <Button
                            size='lg'
                            variant='outline'
                            className='group h-12 px-8 text-base'
                            asChild
                        >
                            <a href='#demo'>
                                <Play className='mr-2 h-4 w-4 transition-transform group-hover:scale-110' />
                                Watch Demo
                            </a>
                        </Button>
                    </div>

                    {/* Trust Indicators */}
                    <div className='mt-16 flex flex-col items-center'>
                        <p className='mb-4 text-sm text-muted-foreground'>
                            Trusted by leading rice mills
                        </p>
                        <div className='flex flex-wrap items-center justify-center gap-8 opacity-60'>
                            {[
                                'Sharma Mills',
                                'Patel Agro',
                                'Krishna Rice',
                                'Gupta Exports',
                                'Tamil Grains',
                            ].map((name) => (
                                <div
                                    key={name}
                                    className='text-lg font-semibold text-muted-foreground'
                                >
                                    {name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dashboard Preview */}
                <div className='relative mx-auto mt-20 max-w-5xl'>
                    <div className='relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl'>
                        <div className='absolute inset-0 z-10 bg-linear-to-t from-background via-transparent to-transparent' />
                        <div className='flex items-center gap-2 border-b border-border bg-muted/50 p-4'>
                            <div className='h-3 w-3 rounded-full bg-destructive' />
                            <div className='h-3 w-3 rounded-full bg-chart-4' />
                            <div className='h-3 w-3 rounded-full bg-chart-2' />
                            <span className='ml-4 text-sm text-muted-foreground'>
                                Rice Mill Dashboard
                            </span>
                        </div>
                        <div className='flex aspect-video items-center justify-center bg-linear-to-br from-muted to-muted/50'>
                            <div className='text-center'>
                                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
                                    <Play className='h-8 w-8 text-primary' />
                                </div>
                                <p className='text-muted-foreground'>
                                    Dashboard Preview
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Glow Effect */}
                    <div className='absolute -inset-4 -z-10 bg-linear-to-r from-primary/20 via-chart-2/20 to-chart-1/20 opacity-30 blur-3xl' />
                </div>
            </div>
        </section>
    )
}
