import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitch } from '@/components/language-switch'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DateRangePicker } from './components/date-range-picker'
import { useDailySalesDealList, useDailySalesDealSummary } from './data/hooks'

export function SalesDealsReport() {
    const { t } = useTranslation('millStaff')
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()
    const sidebarData = getMillAdminSidebarData(millId || '')

    const search = Object.fromEntries(searchParams.entries())

    // Extract query params from URL
    const queryParams = useMemo(
        () => ({
            page: search.page ? parseInt(search.page as string, 10) : 1,
            limit: search.limit ? parseInt(search.limit as string, 10) : 50,
            search: search.search as string | undefined,
            startDate: search.startDate as string | undefined,
            endDate: search.endDate as string | undefined,
            sortBy: (search.sortBy as string) || 'date',
            sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
        }),
        [search]
    )

    // Fetch daily sales deal data using the hook
    const {
        data: salesDealResponse,
        isLoading,
        isError,
    } = useDailySalesDealList(millId || '', queryParams, { enabled: !!millId })

    // Fetch summary data
    const { data: summaryResponse } = useDailySalesDealSummary(
        millId || '',
        { startDate: queryParams.startDate, endDate: queryParams.endDate },
        { enabled: !!millId }
    )

    // Transform API response to table format - group by commodity
    const salesDealsData = useMemo(() => {
        if (!salesDealResponse?.data) return []

        // Group by commodity and sum quantities
        const groupedData = salesDealResponse.data.reduce(
            (acc, item) => {
                const key = item.commodityType
                    ? `${item.commodity} (${item.commodityType})`
                    : item.commodity
                if (!acc[key]) {
                    acc[key] = { description: key, quantity: 0 }
                }
                acc[key].quantity += item.quantity
                return acc
            },
            {} as Record<string, { description: string; quantity: number }>
        )

        return Object.values(groupedData)
    }, [salesDealResponse])

    // Handle date range change
    const handleDateChange = (
        range: { from?: Date; to?: Date } | undefined
    ) => {
        const newParams = new URLSearchParams(searchParams)
        if (range?.from) {
            newParams.set('startDate', range.from.toISOString().split('T')[0])
        } else {
            newParams.delete('startDate')
        }
        if (range?.to) {
            newParams.set('endDate', range.to.toISOString().split('T')[0])
        } else {
            newParams.delete('endDate')
        }
        setSearchParams(newParams)
    }

    // Parse current date range from URL
    const dateRange = useMemo(() => {
        const from = search.startDate ? new Date(search.startDate) : new Date()
        const to = search.endDate ? new Date(search.endDate) : new Date()
        return { from, to }
    }, [search.startDate, search.endDate])

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

            <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>
                            {t('dailyReports.salesDealsPage.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('dailyReports.salesDealsPage.subtitle')}
                        </p>
                    </div>
                    <DateRangePicker
                        date={dateRange}
                        onDateChange={handleDateChange}
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Sales Summary
                            {summaryResponse && (
                                <span className='ml-2 text-sm font-normal text-muted-foreground'>
                                    ({summaryResponse.totalDeals} deals,{' '}
                                    {summaryResponse.totalQuantity.toFixed(2)}{' '}
                                    qty, ₹
                                    {summaryResponse.totalAmount.toLocaleString()}
                                    )
                                </span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <LoadingSpinner className='h-full w-full' />
                        ) : isError ? (
                            <div className='py-10 text-center text-destructive'>
                                Failed to load sales deal data
                            </div>
                        ) : (
                            <div className='overflow-x-auto'>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className='w-[300px]'>
                                                Description
                                            </TableHead>
                                            <TableHead className='text-right'>
                                                Quantity
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {salesDealsData.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={2}
                                                    className='text-center text-muted-foreground'
                                                >
                                                    No sales deal data found for
                                                    the selected date range
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            salesDealsData.map(
                                                (deal, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell className='font-medium'>
                                                            {deal.description}
                                                        </TableCell>
                                                        <TableCell className='text-right'>
                                                            {deal.quantity.toFixed(
                                                                2
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Main>
        </>
    )
}
