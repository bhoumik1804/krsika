import { ShoppingCart, Receipt, IndianRupee } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitch } from '@/components/language-switch'
import { getMillStaffSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

interface DealItem {
    description: string
    quantity: number
}

const PURCHASE_DEALS_DATA: DealItem[] = [
    { description: 'Paddy (Mota)', quantity: 0 },
    { description: 'Paddy (Patla)', quantity: 0 },
    { description: 'Paddy (Sarna)', quantity: 0 },
    { description: 'Paddy (Mahamaya)', quantity: 0 },
    { description: 'Paddy (RB GOLD)', quantity: 0 },
    { description: 'Rice (Patla)', quantity: 0 },
    { description: 'Rice (Mota)', quantity: 0 },
    { description: 'FRK', quantity: 0 },
    { description: 'New Gunny', quantity: 0 },
    { description: 'Old Gunny', quantity: 0 },
    { description: 'Plastic Gunny', quantity: 0 },
]

const SALES_DEALS_DATA: DealItem[] = [
    { description: 'Paddy (Mota)', quantity: 0 },
    { description: 'Paddy (Patla)', quantity: 0 },
    { description: 'Paddy (Sarna)', quantity: 0 },
    { description: 'Paddy (Mahamaya)', quantity: 0 },
    { description: 'Paddy (RB GOLD)', quantity: 0 },
    { description: 'Rice (Patla)', quantity: 0 },
    { description: 'Rice (Mota)', quantity: 0 },
    { description: 'FRK', quantity: 0 },
    { description: 'New Gunny', quantity: 0 },
    { description: 'Old Gunny', quantity: 0 },
    { description: 'Plastic Gunny', quantity: 0 },
    { description: 'Khanda', quantity: 0 },
    { description: 'Bhusa', quantity: 0 },
    { description: 'Nakkhi', quantity: 0 },
]

const OTHER_DEALS: DealItem[] = [
    { description: 'Inwards', quantity: 0 },
    { description: 'Outwards', quantity: 0 },
    { description: 'Milling', quantity: 0 },
    { description: 'Production', quantity: 0 },
]

const PAYMENT_CATEGORIES: DealItem[] = [
    { description: 'Party Name / Broker Name', quantity: 0 },
    { description: 'Transporter', quantity: 0 },
    { description: 'Diesel', quantity: 0 },
    { description: 'Allowance', quantity: 0 },
    { description: 'Repair / Maintenance', quantity: 0 },
    { description: 'Hamali', quantity: 0 },
    { description: 'Salary', quantity: 0 },
    { description: 'Other Expenses', quantity: 0 },
]

export function DailyReportsOverview() {
    const { t } = useTranslation()
    const { millId } = useParams<{ millId: string; staffId: string }>()
    const sidebarData = getMillStaffSidebarData(millId || '')

    return (
        <>
            <Header fixed>
                <Search />
                <div className='ms-auto flex items-center space-x-4'>
                    <LanguageSwitch />
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown
                        user={sidebarData.user}
                        links={sidebarData.profileLinks}
                    />
                </div>
            </Header>

            <Main className='flex flex-1 flex-col gap-6 sm:gap-8'>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        {t('dailyReports.title')}
                    </h1>
                    <p className='text-muted-foreground'>
                        {t('dailyReports.subtitle')}
                    </p>
                </div>

                {/* Purchase Deals Section */}
                <div className='flex flex-col gap-3'>
                    <div className='flex items-center gap-2'>
                        <ShoppingCart className='h-5 w-5 text-blue-600' />
                        <h2 className='text-xl font-semibold'>
                            {t('dailyReports.purchaseDeals')}
                        </h2>
                    </div>
                    <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                        {PURCHASE_DEALS_DATA.map((deal) => (
                            <Card
                                key={deal.description}
                                className='flex flex-col justify-between'
                            >
                                <CardHeader className='pb-2'>
                                    <CardTitle className='text-sm font-medium'>
                                        {deal.description}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold'>
                                        {deal.quantity}
                                    </div>
                                    <p className='text-xs text-muted-foreground'>
                                        {t('common.units')}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sales Deals Section */}
                <div className='flex flex-col gap-3'>
                    <div className='flex items-center gap-2'>
                        <Receipt className='h-5 w-5 text-green-600' />
                        <h2 className='text-xl font-semibold'>
                            {t('dailyReports.salesDeals')}
                        </h2>
                    </div>
                    <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                        {SALES_DEALS_DATA.map((deal) => (
                            <Card
                                key={deal.description}
                                className='flex flex-col justify-between'
                            >
                                <CardHeader className='pb-2'>
                                    <CardTitle className='text-sm font-medium'>
                                        {deal.description}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold'>
                                        {deal.quantity}
                                    </div>
                                    <p className='text-xs text-muted-foreground'>
                                        {t('common.units')}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Other Deals Section */}
                <div className='flex flex-col gap-3'>
                    <h2 className='text-xl font-semibold'>
                        {t('dailyReports.otherReports')}
                    </h2>
                    <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-4'>
                        {OTHER_DEALS.map((deal) => (
                            <Card
                                key={deal.description}
                                className='flex flex-col justify-between'
                            >
                                <CardHeader className='pb-2'>
                                    <CardTitle className='text-sm font-medium'>
                                        {deal.description}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold'>
                                        {deal.quantity}
                                    </div>
                                    <p className='text-xs text-muted-foreground'>
                                        {t('common.items')}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Payment Section */}
                <div className='flex flex-col gap-3'>
                    <div className='flex items-center gap-2'>
                        <IndianRupee className='h-5 w-5 text-orange-600' />
                        <h2 className='text-xl font-semibold'>
                            {t('dailyReports.payments')}
                        </h2>
                    </div>
                    <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                        {PAYMENT_CATEGORIES.map((category) => (
                            <Card
                                key={category.description}
                                className='flex flex-col justify-between'
                            >
                                <CardHeader className='pb-2'>
                                    <CardTitle className='text-sm font-medium'>
                                        {category.description}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold'>
                                        {category.quantity}
                                    </div>
                                    <p className='text-xs text-muted-foreground'>
                                        {t('common.amount')}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </Main>
        </>
    )
}
