import * as React from 'react'
import {
    Package,
    Activity,
    IndianRupee,
    Boxes,
    Scale,
    Clock,
    DollarSign,
    ArrowUpRight,
    ShoppingCart,
} from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { DateRangePicker } from '@/components/date-range-picker'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { StatsCard } from '@/components/stats-card'
import { ThemeSwitch } from '@/components/theme-switch'

export function StockOverviewReport() {
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })

    return (
        <>
            {/* ===== Top Heading ===== */}
            <Header>
                <div className='ms-auto flex items-center space-x-4'>
                    <Search />
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown
                        user={sidebarData.user}
                        links={sidebarData.profileLinks}
                    />
                </div>
            </Header>

            {/* ===== Main ===== */}
            <Main>
                <div className='mb-2 flex items-center justify-between space-y-2'>
                    <div>
                        <h1 className='text-2xl font-bold tracking-tight'>
                            Stock Overview
                        </h1>
                        <p className='text-muted-foreground'>
                            Welcome back! Here's your stock overview.
                        </p>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <DateRangePicker date={date} setDate={setDate} />
                        <Button variant='outline'>Export Report</Button>
                    </div>
                </div>

                <div className='space-y-8'>
                    {/* Section 1: Paddy Stock (5 Cards) */}
                    <section>
                        <div className='mb-4 space-y-1'>
                            <h2 className='text-xl font-semibold tracking-tight'>
                                Paddy Stock in Quintol
                            </h2>
                        </div>
                        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
                            <StatsCard
                                title='Paddy (Mota)'
                                value='3,240 Qtl'
                                change='+12%'
                                changeType='positive'
                                icon={ShoppingCart}
                                description='procured today'
                            />
                            <StatsCard
                                title='Paddy (Patla)'
                                value='2,850 Qtl'
                                change='-5%'
                                changeType='negative'
                                icon={Activity}
                                description='high moisture lot'
                            />
                            <StatsCard
                                title='Paddy (Sarna)'
                                value='4,120 Qtl'
                                change='+8%'
                                changeType='positive'
                                icon={Scale}
                                description='total stock'
                            />
                            <StatsCard
                                title='Paddy (Mahamaya)'
                                value='1,240 Qtl'
                                change='Stable'
                                changeType='neutral'
                                icon={IndianRupee}
                                description='current holdings'
                            />
                            <StatsCard
                                title='Paddy (RB Gold)'
                                value='950 Qtl'
                                change='New Lot'
                                changeType='neutral'
                                icon={Clock}
                                description='waiting for unloading'
                            />
                        </div>
                    </section>

                    {/* Section 2 & 5: Rice and Other (Side by Side with Equal Card Widths) */}
                    <div className='grid gap-8 lg:grid-cols-3'>
                        {/* Section 2: Rice Stock in Quintol (2 Cards) - Occupies 2/3 columns */}
                        <section className='lg:col-span-2'>
                            <div className='mb-4 space-y-1'>
                                <h2 className='text-xl font-semibold tracking-tight'>
                                    Rice Stock in Quintol
                                </h2>
                            </div>
                            <div className='grid gap-4 sm:grid-cols-2'>
                                <StatsCard
                                    title='Rice (Mota)'
                                    value='1,840 Qtl'
                                    change='+150 Qtl'
                                    changeType='positive'
                                    icon={Package}
                                    description='produced today'
                                />
                                <StatsCard
                                    title='Rice (Patla)'
                                    value='2,150 Qtl'
                                    change='+240 Qtl'
                                    changeType='positive'
                                    icon={DollarSign}
                                    description='produced today'
                                />
                            </div>
                        </section>

                        {/* Section 5: Other Stock (1 Card) - Occupies 1/3 column */}
                        <section className='lg:col-span-1'>
                            <div className='mb-4 space-y-1'>
                                <h2 className='text-xl font-semibold tracking-tight'>
                                    Other Stock
                                </h2>
                            </div>
                            <div className='grid gap-4'>
                                <StatsCard
                                    title='FRK'
                                    value='420 Qtl'
                                    change='Stable'
                                    changeType='neutral'
                                    icon={Package}
                                    description='fortified rice kernels'
                                />
                            </div>
                        </section>
                    </div>

                    {/* Section 3: By Product Stock (5 Cards) */}
                    <section>
                        <div className='mb-4 space-y-1'>
                            <h2 className='text-xl font-semibold tracking-tight'>
                                By Product Stock
                            </h2>
                        </div>
                        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
                            <StatsCard
                                title='Khanda'
                                value='420 Qtl'
                                change='+12 Qtl'
                                changeType='positive'
                                icon={Boxes}
                                description='broken rice'
                            />
                            <StatsCard
                                title='Kodha'
                                value='180 Qtl'
                                change='Stable'
                                changeType='neutral'
                                icon={Activity}
                                description='bran and dust'
                            />
                            <StatsCard
                                title='Nakkhi'
                                value='240 Qtl'
                                change='+5%'
                                changeType='positive'
                                icon={ArrowUpRight}
                                description='small broken rice'
                            />
                            <StatsCard
                                title='Silky'
                                value='850 Qtl'
                                change='+12%'
                                changeType='positive'
                                icon={IndianRupee}
                                description='high grade bran'
                            />
                            <StatsCard
                                title='Bhusa'
                                value='1,200 Qtl'
                                change='High'
                                changeType='neutral'
                                icon={Clock}
                                description='husk and storage'
                            />
                        </div>
                    </section>

                    {/* Section 4: Gunny Stock (6 Cards with subheadings) */}
                    <section>
                        <div className='mb-4 space-y-1'>
                            <h2 className='text-xl font-semibold tracking-tight'>
                                Gunny Stock
                            </h2>
                        </div>

                        <div className='space-y-6'>
                            <div>
                                <h3 className='mb-3 text-sm font-semibold tracking-wider text-muted-foreground uppercase'>
                                    Filled Gunny
                                </h3>
                                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                                    <StatsCard
                                        title='Gunny (New)'
                                        value='4,500'
                                        change='+500'
                                        changeType='positive'
                                        icon={Boxes}
                                        description='new jute bags'
                                    />
                                    <StatsCard
                                        title='Gunny (Old)'
                                        value='2,800'
                                        change='Stable'
                                        changeType='neutral'
                                        icon={Boxes}
                                        description='repaired bags'
                                    />
                                    <StatsCard
                                        title='Gunny (Plastic)'
                                        value='12,500'
                                        change='-1,200'
                                        changeType='negative'
                                        icon={Boxes}
                                        description='HDPE bags'
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className='mb-3 text-sm font-semibold tracking-wider text-muted-foreground uppercase'>
                                    Empty Gunny
                                </h3>
                                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                                    <StatsCard
                                        title='Gunny (New)'
                                        value='8,200'
                                        change='+1,200'
                                        changeType='positive'
                                        icon={Boxes}
                                        description='new jute bags'
                                    />
                                    <StatsCard
                                        title='Gunny (Old)'
                                        value='1,450'
                                        change='Stable'
                                        changeType='neutral'
                                        icon={Boxes}
                                        description='repaired bags'
                                    />
                                    <StatsCard
                                        title='Gunny (Plastic)'
                                        value='15,400'
                                        change='-500'
                                        changeType='negative'
                                        icon={Boxes}
                                        description='HDPE bags'
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </Main>
        </>
    )
}
