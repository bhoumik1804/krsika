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
import { useTranslation } from 'react-i18next'
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
    const { t } = useTranslation('mill-staff')
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })

    const payments: PaymentRow[] = [
        {
            description: t('dailyReports.payment.categories.partyBroker'),
            amount: 0,
            icon: Users,
        },
        {
            description: t('dailyReports.payment.categories.transporter'),
            amount: 0,
            icon: Truck,
        },
        {
            description: t('dailyReports.payment.categories.diesel'),
            amount: 0,
            icon: Fuel,
        },
        {
            description: t('dailyReports.payment.categories.allowance'),
            amount: 0,
            icon: DollarSign,
        },
        {
            description: t('dailyReports.payment.categories.repairMaintenance'),
            amount: 0,
            icon: Wrench,
        },
        {
            description: t('dailyReports.payment.categories.hamali'),
            amount: 0,
            icon: Contact,
        },
        {
            description: t('dailyReports.payment.categories.salary'),
            amount: 0,
            icon: UserPlus,
        },
        {
            description: t('dailyReports.payment.categories.otherExpenses'),
            amount: 0,
            icon: Activity,
        },
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
                            {t('dailyReports.payment.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('dailyReports.payment.description')}
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
