import { useState } from 'react'
import { Users } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { DateRangePicker } from '@/components/date-range-picker'
import { getMillStaffSidebarData } from '@/components/layout/data'
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
    const { t } = useTranslation('mill-staff')
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillStaffSidebarData(millId || '')
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })

    const receipts: ReceiptRow[] = Array.from({ length: 5 }).map((_, i) => ({
        partyName: `${t('dailyReports.receipt.partyPrefix')} ${i + 1}`,
        brokerName: `${t('dailyReports.receipt.brokerPrefix')} ${i + 1}`,
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
                            {t('dailyReports.receipt.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('dailyReports.receipt.description')}
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
