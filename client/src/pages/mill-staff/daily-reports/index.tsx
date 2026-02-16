import {
    ShoppingCart,
    Receipt,
    ArrowLeftToLine,
    ArrowRightFromLine,
    BarChart3,
    Package,
    Boxes,
    FileText,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillStaffSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export function DailyReportsOverview() {
    const { t } = useTranslation('mill-staff')
    const { millId } = useParams<{ millId: string }>()
    const navigate = useNavigate()
    const sidebarData = getMillStaffSidebarData(millId || '')

    const reports = [
        {
            title: t('dailyReports.purchaseDeals.title'),
            description: t('dailyReports.purchaseDeals.description'),
            icon: ShoppingCart,
            url: `/staff/${millId}/daily/reports/purchase`,
            color: 'text-blue-500',
        },
        {
            title: t('dailyReports.salesDeals.title'),
            description: t('dailyReports.salesDeals.description'),
            icon: Receipt,
            url: `/staff/${millId}/daily/reports/sales`,
            color: 'text-green-500',
        },
        {
            title: t('dailyReports.inwards.title'),
            description: t('dailyReports.inwards.description'),
            icon: ArrowLeftToLine,
            url: `/staff/${millId}/daily/reports/inwards`,
            color: 'text-indigo-500',
        },
        {
            title: t('dailyReports.outwards.title'),
            description: t('dailyReports.outwards.description'),
            icon: ArrowRightFromLine,
            url: `/staff/${millId}/daily/reports/outwards`,
            color: 'text-orange-500',
        },
        {
            title: t('dailyReports.milling.title'),
            description: t('dailyReports.milling.description'),
            icon: BarChart3,
            url: `/staff/${millId}/daily/reports/milling`,
            color: 'text-purple-500',
        },
        {
            title: t('dailyReports.production.title'),
            description: t('dailyReports.production.description'),
            icon: Package,
            url: `/staff/${millId}/daily/reports/production`,
            color: 'text-rose-500',
        },
        {
            title: t('dailyReports.receipt.title'),
            description: t('dailyReports.receipt.description'),
            icon: Boxes,
            url: `/staff/${millId}/daily/reports/receipt`,
            color: 'text-cyan-500',
        },
        {
            title: t('dailyReports.payment.title'),
            description: t('dailyReports.payment.description'),
            icon: FileText,
            url: `/staff/${millId}/daily/reports/payment`,
            color: 'text-amber-500',
        },
    ]

    return (
        <>
            <Header fixed>
                <div className='flex items-center gap-2'>
                    <h1 className='text-lg font-semibold'>
                        {t('dailyReports.title')}
                    </h1>
                </div>
                <div className='ms-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown
                        user={sidebarData.user}
                        links={sidebarData.profileLinks}
                    />
                </div>
            </Header>

            <Main>
                <div className='mb-6'>
                    <h1 className='text-2xl font-bold tracking-tight'>
                        {t('dailyReports.overview.title')}
                    </h1>
                    <p className='text-muted-foreground'>
                        {t('dailyReports.overview.description')}
                    </p>
                </div>

                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    {reports.map((report) => (
                        <Card
                            key={report.url}
                            className='cursor-pointer transition-all hover:bg-muted/50'
                            onClick={() => navigate(report.url)}
                        >
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>
                                    {report.title}
                                </CardTitle>
                                <report.icon
                                    className={`h-4 w-4 ${report.color}`}
                                />
                            </CardHeader>
                            <CardContent>
                                <CardDescription className='text-xs'>
                                    {report.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </Main>
        </>
    )
}
