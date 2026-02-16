import { useState } from 'react'
import { Users } from 'lucide-react'
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

type ReceiptRow = {
    partyName: string
    brokerName: string
    amount: number
}

export function ReceiptReport() {
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })

    // Sample data structure for Receipt
    const receipts: ReceiptRow[] = Array.from({ length: 5 }).map((_, i) => ({
        partyName: `Party ${i + 1}`,
        brokerName: `Broker ${i + 1}`,
        amount: 0,
    }))

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
                            Daily Receipt
                        </h2>
                        <p className='text-muted-foreground'>
                            Track daily financial receipts
                        </p>
                    </div>
                    <DateRangePicker date={date} setDate={setDate} />
                </div>

                <div className='grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                    {receipts.map((row, index) => (
                        <StatsCard
                            key={index}
                            title={`${row.partyName} / ${row.brokerName}`}
                            value={`₹${row.amount.toLocaleString('en-IN')}`}
                            icon={Users}
                        />
                    ))}
                </div>
            </Main>
        </>
    )
}
