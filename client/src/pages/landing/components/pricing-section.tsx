import { useEffect, useState } from 'react'
import { formatCurrency, API_URL } from '@/constants'
import type { PricingPlan } from '@/types'
import { CircleCheckBig, Loader2 } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { pricingData } from '../data'

// ==========================================
// Pricing Card Component
// ==========================================
// ... (omitting PricingCard and PricingCardSkeleton for brevity as they don't change logic, just props)
// (Wait, I need to keep the file structure intact, so I'll just replace the whole relevant chunk)

// ==========================================
// Pricing Card Component
// ==========================================

interface PricingCardProps {
    plan: PricingPlan
}

function PricingCard({ plan }: PricingCardProps) {
    return (
        <Card
            className={`relative flex flex-col ${
                plan.isPopular
                    ? 'scale-105 border-primary shadow-lg shadow-primary/10'
                    : 'border-border'
            }`}
        >
            {plan.isPopular && (
                <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
                    <Badge className='bg-primary px-4 py-1 text-primary-foreground'>
                        Most Popular
                    </Badge>
                </div>
            )}

            <CardHeader className='pt-8 pb-2 text-center'>
                <h3 className='text-xl font-bold text-foreground'>
                    {plan.name}
                </h3>
                <p className='mt-2 text-sm text-muted-foreground'>
                    {plan.description}
                </p>
            </CardHeader>

            <CardContent className='grow text-center'>
                {/* Price */}
                <div className='my-6'>
                    <span className='text-4xl font-bold text-foreground'>
                        {formatCurrency(plan.price)}
                    </span>
                    <span className='text-muted-foreground'>
                        /{plan.billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                </div>

                {/* Features */}
                <ul className='space-y-3 text-left'>
                    {plan.features.map((feature) => (
                        <li key={feature} className='flex items-start gap-3'>
                            <CircleCheckBig className='mt-0.5 h-5 w-5 shrink-0 text-primary' />
                            <span className='text-sm text-muted-foreground'>
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter className='pt-4'>
                <Button
                    className='w-full'
                    variant={plan.isPopular ? 'default' : 'outline'}
                    asChild
                >
                    <Link to='/sign-up'>Start Free Trial</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

// ==========================================
// Loading Skeleton
// ==========================================

function PricingCardSkeleton() {
    return (
        <Card className='flex flex-col'>
            <CardHeader className='pt-8 pb-2 text-center'>
                <div className='mx-auto h-6 w-24 animate-pulse rounded bg-muted' />
                <div className='mx-auto mt-4 h-4 w-48 animate-pulse rounded bg-muted' />
            </CardHeader>
            <CardContent className='grow text-center'>
                <div className='my-6'>
                    <div className='mx-auto h-10 w-32 animate-pulse rounded bg-muted' />
                </div>
                <div className='space-y-3'>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className='h-4 w-full animate-pulse rounded bg-muted'
                        />
                    ))}
                </div>
            </CardContent>
            <CardFooter className='pt-4'>
                <div className='h-10 w-full animate-pulse rounded bg-muted' />
            </CardFooter>
        </Card>
    )
}

// ==========================================
// Main Pricing Section Component
// ==========================================

export function PricingSection() {
    const [plans, setPlans] = useState<PricingPlan[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchPlans() {
            try {
                setLoading(true)
                setError(null)

                // Fetch pricing plans from API (managed by Super Admin)
                const response = await fetch(`${API_URL}/pricing/plans`)

                if (!response.ok) {
                    throw new Error('Failed to fetch pricing plans')
                }

                const data = await response.json()
                setPlans(data.plans || data)
            } catch (err) {
                console.warn('Using fallback pricing plans:', err)
                // Use fallback plans if API fails
                setPlans(pricingData.fallbackPlans)
                setError(null) // Don't show error to user, just use fallback
            } finally {
                setLoading(false)
            }
        }

        fetchPlans()
    }, [])

    // Use fallback plans if no plans loaded
    const displayPlans = plans.length > 0 ? plans : pricingData.fallbackPlans

    return (
        <section id='pricing' className='bg-background py-24'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Section Header */}
                <div className='mx-auto mb-16 max-w-3xl text-center'>
                    <span className='text-sm font-semibold tracking-wider text-primary uppercase'>
                        {pricingData.badge}
                    </span>
                    <h2 className='mt-4 mb-6 text-3xl font-bold text-foreground sm:text-4xl'>
                        {pricingData.title}
                    </h2>
                    <p className='text-lg text-muted-foreground'>
                        {pricingData.description}
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className='mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3'>
                    {loading ? (
                        // Loading skeletons
                        <>
                            <PricingCardSkeleton />
                            <PricingCardSkeleton />
                            <PricingCardSkeleton />
                        </>
                    ) : error ? (
                        // Error state with retry
                        <div className='col-span-full text-center'>
                            <Loader2 className='mx-auto mb-4 h-8 w-8 animate-spin text-muted-foreground' />
                            <p className='text-muted-foreground'>{error}</p>
                        </div>
                    ) : (
                        // Render pricing cards
                        displayPlans.map((plan) => (
                            <PricingCard key={plan.id} plan={plan} />
                        ))
                    )}
                </div>

                {/* Additional Info */}
                <div className='mt-12 text-center text-sm text-muted-foreground'>
                    <p>
                        All prices are in INR and exclude GST. Annual billing
                        saves 20%.
                    </p>
                </div>
            </div>
        </section>
    )
}
