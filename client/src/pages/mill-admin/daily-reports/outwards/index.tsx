import { useState } from 'react'
import { Package, Boxes, Scale, Info, ShoppingCart } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { useParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { DateRangePicker } from '@/components/date-range-picker'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { StatsCard } from '@/components/stats-card'
import { ThemeSwitch } from '@/components/theme-switch'

type OutwardRow = {
    description: string
    quantity: number
    icon: any
}

export function OutwardsReport() {
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })

    // Sample data matching the image categories
    const outwards: OutwardRow[] = [
        { description: 'Paddy (Mota)', quantity: 0, icon: Boxes },
        { description: 'Paddy (Patla)', quantity: 0, icon: Boxes },
        { description: 'Paddy (Sarna)', quantity: 0, icon: Boxes },
        { description: 'Paddy (Mahamaya)', quantity: 0, icon: Boxes },
        { description: 'Paddy (RB GOLD)', quantity: 0, icon: Boxes },
        { description: 'Rice (Patla)', quantity: 0, icon: Package },
        { description: 'Rice (Mota)', quantity: 0, icon: Package },
        { description: 'FRK', quantity: 0, icon: Scale },
        { description: 'New Gunny', quantity: 0, icon: Info },
        { description: 'Old Gunny', quantity: 0, icon: Info },
        { description: 'Plastic Gunny', quantity: 0, icon: Info },
        { description: 'Khanda', quantity: 0, icon: ShoppingCart },
        { description: 'Bhusa', quantity: 0, icon: ShoppingCart },
        { description: 'Nakkhi', quantity: 0, icon: ShoppingCart },
        { description: 'Silky Koda', quantity: 0, icon: ShoppingCart },
    ]

    return (
        <>
            <Header fixed>
                <Search />
                <div className='ms-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown
                        user={sidebarData.user}
                        links={sidebarData.profileLinks}
                    />
                </div>
            </Header>

            <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>
                            Outwards
                        </h2>
                        <p className='text-muted-foreground'>
                            Track daily outward transactions by commodity
                        </p>
                    </div>
                    <DateRangePicker date={date} setDate={setDate} />
                </div>

                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
                    {outwards.map((row, index) => (
                        <StatsCard
                            key={index}
                            title={row.description}
                            value={`${row.quantity.toFixed(2)} Qtl`}
                            icon={row.icon}
                        />
                    ))}
                </div>
            </Main>
        </>
    )
}
