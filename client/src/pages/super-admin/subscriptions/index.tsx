import { useState } from 'react'
import {
    Check,
    ArrowRight,
    TrendingUp,
    Users,
    Building,
    Activity,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { superAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { SubscriptionActionDialog } from './components/subscription-action-dialog'
import { plans, type SubscriptionPlan } from './data/plans'

export function Subscriptions() {
    const [currentRow, setCurrentRow] = useState<SubscriptionPlan | null>(null)
    const [open, setOpen] = useState(false)

    return (
        <>
            <Header fixed>
                <Search />
                <div className='ms-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown
                        user={superAdminSidebarData.user}
                        links={superAdminSidebarData.profileLinks}
                    />
                </div>
            </Header>

            <Main className='flex flex-1 flex-col gap-8'>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        Subscriptions
                    </h1>
                    <p className='text-muted-foreground'>
                        Manage platform subscription plans and billing cycles.
                    </p>
                </div>

                {/* Stats Row */}
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Monthly Revenue
                            </CardTitle>
                            <TrendingUp className='h-4 w-4 text-primary' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>₹4,52,310</div>
                            <p className='text-xs text-muted-foreground'>
                                +12% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Active Subs
                            </CardTitle>
                            <Activity className='h-4 w-4 text-primary' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>124</div>
                            <p className='text-xs text-muted-foreground'>
                                86 Pro, 38 Enterprise
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Total Mills
                            </CardTitle>
                            <Building className='h-4 w-4 text-primary' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>348</div>
                            <p className='text-xs text-muted-foreground'>
                                Across all plans
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Churn Rate
                            </CardTitle>
                            <Users className='h-4 w-4 text-destructive' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>1.2%</div>
                            <p className='text-xs text-muted-foreground'>
                                Decrease of 0.3%
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Plans Grid */}
                <div className='grid gap-6 lg:grid-cols-3'>
                    {plans.map((plan) => {
                        const Icon = plan.icon
                        return (
                            <Card
                                key={plan.name}
                                className={`relative flex flex-col ${plan.popular ? 'z-10 scale-105 border-primary shadow-lg' : ''}`}
                            >
                                {plan.popular && (
                                    <Badge
                                        className='absolute -top-3 left-1/2 -translate-x-1/2'
                                        variant='default'
                                    >
                                        MOST POPULAR
                                    </Badge>
                                )}
                                <CardHeader>
                                    <div
                                        className={`mb-2 w-fit rounded-lg ${plan.bg} p-2`}
                                    >
                                        <Icon
                                            className={`h-6 w-6 ${plan.color}`}
                                        />
                                    </div>
                                    <CardTitle className='text-2xl'>
                                        {plan.name}
                                    </CardTitle>
                                    <CardDescription>
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className='flex-1'>
                                    <div className='mb-6 flex items-baseline gap-1'>
                                        <span className='text-4xl font-bold'>
                                            {plan.price}
                                        </span>
                                        <span className='text-sm text-muted-foreground'>
                                            /{plan.duration}
                                        </span>
                                    </div>
                                    <ul className='space-y-3 text-sm'>
                                        {plan.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className='flex items-center gap-2'
                                            >
                                                <Check className='h-4 w-4 text-primary' />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className='w-full'
                                        variant={plan.buttonVariant}
                                        onClick={() => {
                                            setCurrentRow(plan)
                                            setOpen(true)
                                        }}
                                    >
                                        Edit Plan Details
                                        <ArrowRight className='ml-2 h-4 w-4' />
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>

                {/* Recent Transactions Placeholder */}
                <Card className='mt-4'>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>
                            View the latest billing activity across the
                            platform.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex h-[200px] items-center justify-center border-t text-muted-foreground italic'>
                        No recent transactions found. Billing system connected
                        to Stripe/Razorpay will appear here.
                    </CardContent>
                </Card>
            </Main>

            <SubscriptionActionDialog
                key={currentRow?.name || 'subscription-action'}
                open={open}
                onOpenChange={setOpen}
                currentRow={currentRow || undefined}
            />
        </>
    )
}
