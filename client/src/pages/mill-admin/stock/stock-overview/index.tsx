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
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { StatsCard } from '@/components/stats-card'
import { ThemeSwitch } from '@/components/theme-switch'

// Helper to categorize items
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
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')
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
            // If querying "as of date", we usually use the end of the range
            if (date?.to) {
                params.asOfDate = formatDateForApi(date.to)
            } else if (date?.from) {
                params.asOfDate = formatDateForApi(date.from)
            }

            const response = await getStockBalance(millId, params)
            // Fix: Access response.data.balances instead of response.balances
            // The API wrapper returns { statusCode, data, message, success }
            // So we need to access response.data (which is the payload)
            // Wait, looking at api-client structure:
            // If apiClient returns AxiosResponse<ApiResponse<T>>, then response.data is ApiResponse<T>
            // ApiResponse<T> has a 'data' field of type T.
            // In stock-transaction-api.ts, T is { balances: StockBalance[] }
            // So it should be response.data.balances.
            // Let's assume response here IS the ApiResponse object (because getStockBalance returns response.data from axios)
            // So yes, response.data.balances
            // But wait, my manual type definition in api-client.ts might be slightly different?
            // Let's use 'as any' casting if needed to be safe, or just trust the types.
            // Based on previous error "Property 'balances' does not exist on type 'ApiResponse...'", it means 'balances' is inside 'data'.
            const apiResponse: any = response
            setData(apiResponse.data?.balances || [])
        } catch (err: any) {
            setError(err?.message || 'Failed to fetch stock balance')
        } finally {
            setLoading(false)
        }
    }, [millId, date])

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

    // Categorize data
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
                                    ? `${item.balance.toLocaleString()} Bags`
                                    : `${item.balance.toLocaleString()} Qtl`
                            }
                            icon={getIcon(item.commodity)}
                            change={
                                item.totalBags > 0
                                    ? `${item.totalBags} Bags`
                                    : undefined
                            }
                            changeType='neutral'
                            description={
                                getCategory(item.commodity) === 'Gunny'
                                    ? 'Total Bags'
                                    : 'Current Stock'
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
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>
                            Stock Overview
                        </h2>
                        <p className='text-muted-foreground'>
                            {asOfDateStr
                                ? `Stock balance as of ${asOfDateStr}`
                                : 'Current stock positions grouped by commodity'}
                        </p>
                    </div>
                    <div className='flex flex-col gap-2 sm:flex-row sm:items-center items-start'>
                        <DateRangePicker date={date} setDate={setDate} />
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={handleExport}
                            disabled={loading || data.length === 0}
                            className='w-auto'
                        >
                            <Download className='mr-2 h-4 w-4' />
                            Export
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
                        <p>No stock data available</p>
                    </div>
                )}

                {!loading && !error && data.length > 0 && (
                    <div className='space-y-8'>
                        {renderSection('Paddy Stock', categorized.Paddy)}

                        <div className='grid gap-8 lg:grid-cols-3'>
                            <div className='lg:col-span-2'>
                                {renderSection(
                                    'Rice Stock',
                                    categorized.Rice,
                                    'sm:grid-cols-2'
                                )}
                            </div>
                            <div className='lg:col-span-1'>
                                {renderSection(
                                    'Other Stock',
                                    categorized.Other,
                                    'grid-cols-1'
                                )}
                            </div>
                        </div>

                        {renderSection(
                            'By Product Stock',
                            categorized['By-Product']
                        )}
                        {renderSection(
                            'Gunny Stock',
                            categorized.Gunny,
                            'sm:grid-cols-2 lg:grid-cols-4'
                        )}
                    </div>
                )}
            </Main>
        </>
    )
}
