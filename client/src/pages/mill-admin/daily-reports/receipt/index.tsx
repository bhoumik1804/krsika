import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import {
    ArrowDownLeft,
    Download,
    Loader2,
    Receipt,
    IndianRupee,
    CreditCard,
    Banknote,
    Landmark,
    QrCode,
} from 'lucide-react'
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
    DailyReceipt,
    DailyReceiptSummary,
    getDailyReceiptList,
    getDailyReceiptSummary,
    exportDailyReceiptsAsCsv,
    formatDateForApi,
} from '@/lib/daily-receipt-api'

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    cleared: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    bounced: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
}

const PAYMENT_MODE_ICONS: Record<string, React.ElementType> = {
    Cash: Banknote,
    Bank: Landmark,
    Cheque: CreditCard,
    UPI: QrCode,
}

export function ReceiptReport() {
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')
    const [date, setDate] = useState<DateRange | undefined>(() => {
        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        return { from: firstDayOfMonth, to: now }
    })

    const [receipts, setReceipts] = useState<DailyReceipt[]>([])
    const [summary, setSummary] = useState<DailyReceiptSummary>({
        totalEntries: 0,
        totalAmount: 0,
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        if (!millId) return
        setLoading(true)
        setError(null)

        try {
            const dateParams = date?.from
                ? {
                    startDate: formatDateForApi(date.from),
                    endDate: date.to
                        ? formatDateForApi(date.to)
                        : formatDateForApi(date.from),
                }
                : {}

            const [listRes, summaryRes] = await Promise.all([
                getDailyReceiptList(millId, {
                    ...dateParams,
                    limit: 500,
                    sortBy: 'date',
                    sortOrder: 'desc',
                }),
                getDailyReceiptSummary(millId, dateParams),
            ])

            setReceipts(listRes.data.dailyReceipts || [])
            setSummary(
                summaryRes.data.summary || { totalEntries: 0, totalAmount: 0 }
            )
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message || 'Failed to fetch receipt data'
            setError(msg)
            setReceipts([])
            setSummary({ totalEntries: 0, totalAmount: 0 })
        } finally {
            setLoading(false)
        }
    }, [millId, date?.from?.toISOString(), date?.to?.toISOString()])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleExport = useCallback(() => {
        const startDate = date?.from ? formatDateForApi(date.from) : ''
        const endDate = date?.to ? formatDateForApi(date.to) : ''
        const filename = `daily-receipts${startDate ? `-${startDate}` : ''}${endDate ? `-to-${endDate}` : ''}`
        exportDailyReceiptsAsCsv(receipts, filename)
    }, [receipts, date])

    // Group receipts by payment mode for summary cards
    const byPaymentMode = receipts.reduce<
        Record<string, { count: number; total: number }>
    >((acc, r) => {
        if (!acc[r.paymentMode]) acc[r.paymentMode] = { count: 0, total: 0 }
        acc[r.paymentMode].count++
        acc[r.paymentMode].total += r.amount
        return acc
    }, {})

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
                            Receipt
                        </h2>
                        <p className='text-muted-foreground'>
                            Track daily receipt transactions
                        </p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <DateRangePicker date={date} setDate={setDate} />
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={handleExport}
                            disabled={loading || receipts.length === 0}
                        >
                            <Download className='mr-2 h-4 w-4' />
                            Export CSV
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

                {!loading && !error && (
                    <>
                        {/* Summary Cards */}
                        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                            <StatsCard
                                title='Total Receipts'
                                value={summary.totalEntries.toString()}
                                icon={Receipt}
                                description='Total receipt entries'
                            />
                            <StatsCard
                                title='Total Amount'
                                value={`₹${summary.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                                icon={IndianRupee}
                                description='Total receipt amount'
                            />
                            {Object.entries(byPaymentMode).map(
                                ([mode, data]) => (
                                    <StatsCard
                                        key={mode}
                                        title={mode}
                                        value={`₹${data.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                                        icon={
                                            PAYMENT_MODE_ICONS[mode] ||
                                            CreditCard
                                        }
                                        description={`${data.count} entries`}
                                    />
                                )
                            )}
                        </div>

                        {/* Data Table */}
                        {receipts.length === 0 ? (
                            <div className='flex flex-col items-center justify-center py-12 text-muted-foreground'>
                                <ArrowDownLeft className='mb-2 h-12 w-12' />
                                <p>
                                    No receipt entries found for the selected
                                    date range
                                </p>
                            </div>
                        ) : (
                            <div className='rounded-lg border'>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Voucher No.</TableHead>
                                            <TableHead>Party Name</TableHead>
                                            <TableHead className='text-right'>
                                                Amount (₹)
                                            </TableHead>
                                            <TableHead>Payment Mode</TableHead>
                                            <TableHead>Purpose</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Remarks</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {receipts.map((receipt) => (
                                            <TableRow key={receipt._id}>
                                                <TableCell>
                                                    {typeof receipt.date ===
                                                        'string'
                                                        ? receipt.date.split(
                                                            'T'
                                                        )[0]
                                                        : format(
                                                            new Date(
                                                                receipt.date
                                                            ),
                                                            'yyyy-MM-dd'
                                                        )}
                                                </TableCell>
                                                <TableCell className='font-mono'>
                                                    {receipt.voucherNumber}
                                                </TableCell>
                                                <TableCell>
                                                    {receipt.partyName}
                                                </TableCell>
                                                <TableCell className='text-right font-medium'>
                                                    ₹
                                                    {receipt.amount.toLocaleString(
                                                        'en-IN',
                                                        {
                                                            minimumFractionDigits: 2,
                                                        }
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {receipt.paymentMode}
                                                </TableCell>
                                                <TableCell className='max-w-[150px] truncate'>
                                                    {receipt.purpose}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant='outline'
                                                        className={
                                                            STATUS_COLORS[
                                                            receipt.status
                                                            ] || ''
                                                        }
                                                    >
                                                        {receipt.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className='max-w-[150px] truncate'>
                                                    {receipt.remarks || '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </>
                )}
            </Main>
        </>
    )
}
