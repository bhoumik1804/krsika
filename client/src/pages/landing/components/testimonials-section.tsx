import { useEffect, useState } from 'react'
import { API_URL } from '@/constants'
import Autoplay from 'embla-carousel-autoplay'
import { Star, Quote } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    CarouselDots,
} from '@/components/ui/carousel'
import { testimonialsData, type Testimonial } from '../data'

// ==========================================
// Testimonial Card Component
// ==========================================

interface TestimonialCardProps {
    testimonial: Testimonial
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <Card className='h-full border-border bg-card transition-shadow duration-300 hover:shadow-lg'>
            <CardContent className='flex h-full flex-col p-6'>
                {/* Quote Icon */}
                <Quote className='mb-4 h-8 w-8 text-primary/20' />

                {/* Rating */}
                <div className='mb-4 flex items-center gap-1'>
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                            key={i}
                            className='h-4 w-4 fill-chart-4 text-chart-4'
                        />
                    ))}
                </div>

                {/* Content */}
                <p className='mb-6 grow leading-relaxed text-muted-foreground'>
                    "{testimonial.content}"
                </p>

                {/* Author */}
                <div className='flex items-center gap-3'>
                    <Avatar>
                        {testimonial.avatar ? (
                            <AvatarImage
                                src={testimonial.avatar}
                                alt={testimonial.name}
                            />
                        ) : null}
                        <AvatarFallback className='bg-primary/10 font-semibold text-primary'>
                            {testimonial.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className='font-semibold text-foreground'>
                            {testimonial.name}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                            {testimonial.role}, {testimonial.company}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                            {testimonial.location}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// ==========================================
// Loading Skeleton
// ==========================================

function TestimonialCardSkeleton() {
    return (
        <Card className='h-full'>
            <CardContent className='flex h-full flex-col p-6'>
                <div className='mb-4 h-8 w-8 animate-pulse rounded bg-muted' />
                <div className='mb-4 flex gap-1'>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className='h-4 w-4 animate-pulse rounded-full bg-muted'
                        />
                    ))}
                </div>
                <div className='mb-6 grow space-y-2'>
                    <div className='h-4 w-full animate-pulse rounded bg-muted' />
                    <div className='h-4 w-full animate-pulse rounded bg-muted' />
                    <div className='h-4 w-3/4 animate-pulse rounded bg-muted' />
                </div>
                <div className='flex items-center gap-3'>
                    <div className='h-10 w-10 animate-pulse rounded-full bg-muted' />
                    <div className='space-y-1'>
                        <div className='h-4 w-24 animate-pulse rounded bg-muted' />
                        <div className='h-3 w-32 animate-pulse rounded bg-muted' />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// ==========================================
// Main Testimonials Section Component
// ==========================================

export function TestimonialsSection() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                setLoading(true)

                // Fetch testimonials from API (managed by Super Admin)
                const response = await fetch(`${API_URL}/testimonials`)

                if (!response.ok) {
                    throw new Error('Failed to fetch testimonials')
                }

                const data = await response.json()
                setTestimonials(data.testimonials || data)
            } catch (err) {
                console.warn('Using fallback testimonials:', err)
                // Use fallback testimonials if API fails
                setTestimonials(testimonialsData.fallbackTestimonials)
            } finally {
                setLoading(false)
            }
        }

        fetchTestimonials()
    }, [])

    // Use fallback if no testimonials loaded
    const displayTestimonials =
        testimonials.length > 0
            ? testimonials
            : testimonialsData.fallbackTestimonials

    return (
        <section id='testimonials' className='bg-muted/30 py-24'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Section Header */}
                <div className='mx-auto mb-16 max-w-3xl text-center'>
                    <span className='text-sm font-semibold tracking-wider text-primary uppercase'>
                        {testimonialsData.badge}
                    </span>
                    <h2 className='mt-4 mb-6 text-3xl font-bold text-foreground sm:text-4xl'>
                        {testimonialsData.title}
                    </h2>
                    <p className='text-lg text-muted-foreground'>
                        {testimonialsData.description}
                    </p>
                </div>

                {/* Testimonials Carousel */}
                {loading ? (
                    // Loading state - show grid of skeletons
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                        <TestimonialCardSkeleton />
                        <TestimonialCardSkeleton />
                        <TestimonialCardSkeleton />
                    </div>
                ) : (
                    <div className='mx-auto max-w-6xl px-4 sm:px-12'>
                        <Carousel
                            opts={{
                                align: 'start',
                                loop: true,
                            }}
                            plugins={[
                                Autoplay({
                                    delay: 2000,
                                    stopOnInteraction: false,
                                    stopOnMouseEnter: false,
                                }),
                            ]}
                            draggable={true}
                            className='w-full'
                        >
                            <CarouselContent className='-ml-4'>
                                {displayTestimonials.map((testimonial) => (
                                    <CarouselItem
                                        key={testimonial.id}
                                        className='pl-4 md:basis-1/2 lg:basis-1/3'
                                    >
                                        <TestimonialCard
                                            testimonial={testimonial}
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className='hidden md:flex' />
                            <CarouselNext className='hidden md:flex' />
                            <CarouselDots className='mt-8' />
                        </Carousel>
                    </div>
                )}
            </div>
        </section>
    )
}
