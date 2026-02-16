import { useState, useCallback } from 'react'
import { format } from 'date-fns'
import { ChevronDown, ChevronRight, Download, Loader2 } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import {
    exportStockDataAsCsv,
    exportStockTransactionsAsCsv,
    StockByAction,
    formatDateForApi,
} from '@/lib/stock-transaction-api'
import { useStockByAction } from '@/hooks/use-stock-by-action'
import { useStockTransactions } from '@/hooks/use-stock-transactions'
import { Button } from '@/components/ui/button'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ConfigDrawer } from '@/components/config-drawer'
import { DateRangePicker } from '@/components/date-range-picker'
import { getMillStaffSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { StatsCard } from '@/components/stats-card'
import { ThemeSwitch } from '@/components/theme-switch'

export interface DailyReportPageProps {
    action: string
    title: string
    description: string
    emptyMessage: string
    exportBaseFilename: string
    EmptyIcon: React.ElementType
    getIcon: (commodity: string) => React.ElementType
    commodityIcons?: Record<string, React.ElementType>
    gridCols?: string
}

function getLabel(item: StockByAction) {
    if (item.variety) return `${item.commodity} (${item.variety})`
    return item.commodity
}

export function DailyReportPage({
    action,
    title,
    description,
    emptyMessage,
    exportBaseFilename,
    EmptyIcon,
    getIcon,
    gridCols = 'sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5',
}: DailyReportPageProps) {
    const { t } = useTranslation('mill-staff')
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillStaffSidebarData(millId || '')
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })
    const [historyOpen, setHistoryOpen] = useState(false)

    const { data, loading, error } = useStockByAction({
        millId: millId || '',
        action,
        dateRange: date,
    })

    const { data: transactions, loading: transactionsLoading } =
        useStockTransactions({
            millId: millId || '',
            action,
            dateRange: date,
            limit: 1000,
        })

    const dateRangeForExport = {
        startDate: date?.from ? formatDateForApi(date.from) : undefined,
        endDate: date?.to ? formatDateForApi(date.to) : undefined,
    }

    const handleExportSummary = useCallback(() => {
        exportStockDataAsCsv(data, exportBaseFilename, dateRangeForExport)
    }, [
        data,
        exportBaseFilename,
        dateRangeForExport.startDate,
        dateRangeForExport.endDate,
    ])

    const handleExportHistory = useCallback(() => {
        exportStockTransactionsAsCsv(
            transactions,
            `${exportBaseFilename}-history`,
            dateRangeForExport
        )
    }, [
        transactions,
        exportBaseFilename,
        dateRangeForExport.startDate,
        dateRangeForExport.endDate,
    ])

    // Group transactions by date for display
    const byDate = transactions.reduce<Record<string, typeof transactions>>(
        (acc, t) => {
            const d =
                typeof t.date === 'string'
                    ? t.date.split('T')[0]
                    : format(new Date(t.date), 'yyyy-MM-dd')
            if (!acc[d]) acc[d] = []
            acc[d].push(t)
            return acc
        },
        {}
    )
    const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a))

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
                            {title}
                        </h2>
                        <p className='text-muted-foreground'>{description}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <DateRangePicker date={date} setDate={setDate} />
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={handleExportSummary}
                            disabled={loading || data.length === 0}
                        >
                            <Download className='mr-2 h-4 w-4' />
                            {t('common.exportSummary')}
                        </Button>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={handleExportHistory}
                            disabled={
                                transactionsLoading || transactions.length === 0
                            }
                        >
                            <Download className='mr-2 h-4 w-4' />
                            {t('common.exportHistory')}
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
                        <EmptyIcon className='mb-2 h-12 w-12' />
                        <p>{emptyMessage}</p>
                    </div>
                )}

                {!loading && !error && data.length > 0 && (
                    <>
                        <div className={`grid gap-4 ${gridCols}`}>
                            {data.map((item, index) => (
                                <StatsCard
                                    key={`${item.commodity}-${item.variety ?? index}`}
                                    title={getLabel(item)}
                                    value={`${item.totalQuantity.toFixed(2)} ${t('common.quintal')}`}
                                    icon={getIcon(item.commodity)}
                                    description={t(
                                        'dailyReports.summaryCardDescription',
                                        {
                                            count: item.count,
                                            bags: item.totalBags,
                                        }
                                    )}
                                />
                            ))}
                        </div>

                        {transactions.length > 0 && (
                            <Collapsible
                                open={historyOpen}
                                onOpenChange={setHistoryOpen}
                            >
                                <CollapsibleTrigger asChild>
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        className='gap-2'
                                    >
                                        {historyOpen ? (
                                            <ChevronDown className='h-4 w-4' />
                                        ) : (
                                            <ChevronRight className='h-4 w-4' />
                                        )}
                                        {t('common.dateWiseHistory')} (
                                        {transactions.length}{' '}
                                        {t('common.transactions')})
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className='mt-4 rounded-lg border'>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>
                                                        {t('common.date')}
                                                    </TableHead>
                                                    <TableHead>
                                                        {t('common.commodity')}
                                                    </TableHead>
                                                    <TableHead>
                                                        {t('common.variety')}
                                                    </TableHead>
                                                    <TableHead>
                                                        {t('common.type')}
                                                    </TableHead>
                                                    <TableHead className='text-right'>
                                                        {t('common.quantity')} (
                                                        {t('common.quintal')})
                                                    </TableHead>
                                                    <TableHead className='text-right'>
                                                        {t('common.bags')}
                                                    </TableHead>
                                                    <TableHead>
                                                        {t('common.remarks')}
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {sortedDates.flatMap((d) =>
                                                    byDate[d].map((t) => (
                                                        <TableRow key={t._id}>
                                                            <TableCell>
                                                                {d}
                                                            </TableCell>
                                                            <TableCell>
                                                                {t.commodity}
                                                            </TableCell>
                                                            <TableCell>
                                                                {t.variety ||
                                                                    '-'}
                                                            </TableCell>
                                                            <TableCell>
                                                                {t.type}
                                                            </TableCell>
                                                            <TableCell className='text-right'>
                                                                {t.quantity.toFixed(
                                                                    2
                                                                )}
                                                            </TableCell>
                                                            <TableCell className='text-right'>
                                                                {t.bags}
                                                            </TableCell>
                                                            <TableCell className='max-w-[200px] truncate'>
                                                                {t.remarks ||
                                                                    '-'}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        )}
                    </>
                )}
            </Main>
        </>
    )
}
