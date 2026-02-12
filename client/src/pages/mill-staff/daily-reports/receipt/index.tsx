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
import { useDailyReceiptList, useDailyReceiptSummary } from './data/hooks'

export function ReceiptReport() {
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

    // Fetch daily receipt data using the hook
    const {
        data: receiptResponse,
        isLoading,
        isError,
    } = useDailyReceiptList(millId || '', queryParams, { enabled: !!millId })

    // Fetch summary data
    const { data: summaryResponse } = useDailyReceiptSummary(
        millId || '',
        { startDate: queryParams.startDate, endDate: queryParams.endDate },
        { enabled: !!millId }
    )

    // Transform API response to table format
    const receiptsData = useMemo(() => {
        if (!receiptResponse?.data) return []
        return receiptResponse.data.map((item) => ({
            partyName: item.partyName,
            purpose: item.purpose,
            amount: item.amount,
        }))
    }, [receiptResponse])

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
                            {t('dailyReports.receipt.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('dailyReports.receipt.subtitle')}
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
                            Receipt Summary
                            {summaryResponse && (
                                <span className='ml-2 text-sm font-normal text-muted-foreground'>
                                    ({summaryResponse.totalEntries} entries, ₹
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
                                Failed to load receipt data
                            </div>
                        ) : (
                            <div className='overflow-x-auto'>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead
                                                colSpan={2}
                                                className='border-r text-center'
                                            >
                                                Description
                                            </TableHead>
                                            <TableHead className='text-right'>
                                                Amount (₹)
                                            </TableHead>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead className='w-[300px]'>
                                                Party Name
                                            </TableHead>
                                            <TableHead className='w-[300px] border-r'>
                                                Purpose
                                            </TableHead>
                                            <TableHead className='text-right'></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {receiptsData.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={3}
                                                    className='text-center text-muted-foreground'
                                                >
                                                    No receipt data found for
                                                    the selected date range
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            receiptsData.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className='font-medium'>
                                                        {row.partyName}
                                                    </TableCell>
                                                    <TableCell className='border-r'>
                                                        {row.purpose}
                                                    </TableCell>
                                                    <TableCell className='text-right'>
                                                        {row.amount.toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
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
