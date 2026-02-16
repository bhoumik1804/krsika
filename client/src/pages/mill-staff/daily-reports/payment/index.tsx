import { useState } from 'react'
import {
    IndianRupee,
    Users,
    Truck,
    Fuel,
    DollarSign,
    Wrench,
    Contact,
    UserPlus,
    Activity,
} from 'lucide-react'
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

type PaymentRow = {
    description: string
    amount: number
    icon: any
}

export function PaymentReport() {
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })

    // Sample data matching the image categories
    const payments: PaymentRow[] = [
        { description: 'Party Name / Broker Name', amount: 0, icon: Users },
        { description: 'Transporter', amount: 0, icon: Truck },
        { description: 'Diesel', amount: 0, icon: Fuel },
        { description: 'Allowance', amount: 0, icon: DollarSign },
        { description: 'Repair / Maintenance', amount: 0, icon: Wrench },
        { description: 'Hamali', amount: 0, icon: Contact },
        { description: 'Salary', amount: 0, icon: UserPlus },
        { description: 'Other Expenses', amount: 0, icon: Activity },
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
                            Daily Payments
                        </h2>
                        <p className='text-muted-foreground'>
                            Track all daily payment transactions
                        </p>
                    </div>
                    <DateRangePicker date={date} setDate={setDate} />
                </div>

                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    {payments.map((row, index) => (
                        <StatsCard
                            key={index}
                            title={row.description}
                            value={`₹${row.amount.toLocaleString('en-IN')}`}
                            icon={row.icon || IndianRupee}
                        />
                    ))}
                </div>
            </Main>
        </>
    )
}
