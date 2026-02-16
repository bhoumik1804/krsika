import { useState, useEffect, useCallback } from 'react'
import {
    Package,
    Activity,
    Boxes,
    Scale,
    Loader2,
    Download,
} from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import {
    getStockBalance,
    exportStockBalanceAsCsv,
    StockBalance,
    formatDateForApi,
} from '@/lib/stock-transaction-api'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { DateRangePicker } from '@/components/date-range-picker'
import { getMillStaffSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { StatsCard } from '@/components/stats-card'
import { ThemeSwitch } from '@/components/theme-switch'

const getCategory = (commodity: string) => {
    const c = commodity.toLowerCase()
    if (c.includes('paddy')) return 'Paddy'
    if (c.includes('rice')) return 'Rice'
    if (c.includes('gunny')) return 'Gunny'
    if (
        ['khanda', 'kodha', 'nakkhi', 'silky', 'bhusa'].some((x) =>
            c.includes(x)
        )
    )
        return 'By-Product'
    return 'Other'
}

const getIcon = (commodity: string) => {
    const c = commodity.toLowerCase()
    if (c.includes('paddy')) return Boxes
    if (c.includes('rice')) return Package
    if (c.includes('gunny')) return Boxes
    if (c.includes('frk')) return Scale
    return Activity
}

export function StockOverviewReport() {
    const { t } = useTranslation('mill-staff')
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillStaffSidebarData(millId || '')
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })

    const [data, setData] = useState<StockBalance[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        if (!millId) return
        setLoading(true)
        setError(null)
        try {
            const params: any = {}
            if (date?.to) {
                params.asOfDate = formatDateForApi(date.to)
            } else if (date?.from) {
                params.asOfDate = formatDateForApi(date.from)
            }

            const response = await getStockBalance(millId, params)
            const apiResponse: any = response
            setData(apiResponse.data?.balances || [])
        } catch (err: any) {
            setError(err?.message || t('dailyReports.stockOverview.fetchError'))
        } finally {
            setLoading(false)
        }
    }, [millId, date, t])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const asOfDateStr = date?.to
        ? formatDateForApi(date.to)
        : date?.from
          ? formatDateForApi(date.from)
          : undefined

    const handleExport = useCallback(() => {
        exportStockBalanceAsCsv(data, 'stock-overview', asOfDateStr)
    }, [data, asOfDateStr])

    const categorized = {
        Paddy: data.filter((i) => getCategory(i.commodity) === 'Paddy'),
        Rice: data.filter((i) => getCategory(i.commodity) === 'Rice'),
        'By-Product': data.filter(
            (i) => getCategory(i.commodity) === 'By-Product'
        ),
        Gunny: data.filter((i) => getCategory(i.commodity) === 'Gunny'),
        Other: data.filter((i) => getCategory(i.commodity) === 'Other'),
    }

    const renderSection = (
        title: string,
        items: StockBalance[],
        gridCols = 'sm:grid-cols-2 lg:grid-cols-5'
    ) => {
        if (items.length === 0) return null
        return (
            <section>
                <div className='mb-4 space-y-1'>
                    <h2 className='text-xl font-semibold tracking-tight'>
                        {title}
                    </h2>
                </div>
                <div className={`grid gap-4 ${gridCols}`}>
                    {items.map((item, idx) => (
                        <StatsCard
                            key={idx}
                            title={
                                item.variety
                                    ? `${item.commodity} (${item.variety})`
                                    : item.commodity
                            }
                            value={
                                getCategory(item.commodity) === 'Gunny'
                                    ? `${item.balance.toLocaleString()} ${t('common.bags')}`
                                    : `${item.balance.toLocaleString()} ${t('common.quintal')}`
                            }
                            icon={getIcon(item.commodity)}
                            change={
                                item.totalBags > 0
                                    ? `${item.totalBags} ${t('common.bags')}`
                                    : undefined
                            }
                            changeType='neutral'
                            description={
                                getCategory(item.commodity) === 'Gunny'
                                    ? t('dailyReports.stockOverview.totalBags')
                                    : t(
                                          'dailyReports.stockOverview.currentStock'
                                      )
                            }
                        />
                    ))}
                </div>
            </section>
        )
    }

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
                            {t('dailyReports.stockOverview.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {asOfDateStr
                                ? t('dailyReports.stockOverview.balanceAsOf', {
                                      date: asOfDateStr,
                                  })
                                : t(
                                      'dailyReports.stockOverview.currentDescription'
                                  )}
                        </p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <DateRangePicker date={date} setDate={setDate} />
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={handleExport}
                            disabled={loading || data.length === 0}
                        >
                            <Download className='mr-2 h-4 w-4' />
                            {t('dailyReports.stockOverview.export')}
                        </Button>
                    </div>
                </div>

                {loading && (
                    <div className='flex items-center justify-center py-12'>
                        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
                    </div>
                )}

                {error && (
                    <div className='rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive'>
                        {error}
                    </div>
                )}

                {!loading && !error && data.length === 0 && (
                    <div className='flex flex-col items-center justify-center py-12 text-muted-foreground'>
                        <Activity className='mb-2 h-12 w-12' />
                        <p>{t('dailyReports.stockOverview.noData')}</p>
                    </div>
                )}

                {!loading && !error && data.length > 0 && (
                    <div className='space-y-8'>
                        {renderSection(
                            t('dailyReports.stockOverview.sections.paddy'),
                            categorized.Paddy
                        )}

                        <div className='grid gap-8 lg:grid-cols-3'>
                            <div className='lg:col-span-2'>
                                {renderSection(
                                    t(
                                        'dailyReports.stockOverview.sections.rice'
                                    ),
                                    categorized.Rice,
                                    'sm:grid-cols-2'
                                )}
                            </div>
                            <div className='lg:col-span-1'>
                                {renderSection(
                                    t(
                                        'dailyReports.stockOverview.sections.other'
                                    ),
                                    categorized.Other,
                                    'grid-cols-1'
                                )}
                            </div>
                        </div>

                        {renderSection(
                            t('dailyReports.stockOverview.sections.byProduct'),
                            categorized['By-Product']
                        )}
                        {renderSection(
                            t('dailyReports.stockOverview.sections.gunny'),
                            categorized.Gunny,
                            'sm:grid-cols-2 lg:grid-cols-4'
                        )}
                    </div>
                )}
            </Main>
        </>
    )
}
