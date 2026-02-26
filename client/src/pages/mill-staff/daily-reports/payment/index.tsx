import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import {
    ArrowUpRight,
    Download,
    Loader2,
    Wallet,
    IndianRupee,
    CreditCard,
    Banknote,
    Landmark,
    QrCode,
} from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import {
    DailyPayment,
    DailyPaymentSummary,
    getDailyPaymentList,
    getDailyPaymentSummary,
    exportDailyPaymentsAsCsv,
    formatDateForApi,
} from '@/lib/daily-payment-api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { StatsCard } from '@/components/stats-card'
import { ThemeSwitch } from '@/components/theme-switch'

const STATUS_COLORS: Record<string, string> = {
    pending:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    completed:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    failed: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
}

const PAYMENT_MODE_ICONS: Record<string, React.ElementType> = {
    Cash: Banknote,
    Bank: Landmark,
    Cheque: CreditCard,
    UPI: QrCode,
}

export function PaymentReport() {
    const { t } = useTranslation('mill-staff')
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')
    const [date, setDate] = useState<DateRange | undefined>(() => {
        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        return { from: firstDayOfMonth, to: now }
    })

    const [payments, setPayments] = useState<DailyPayment[]>([])
    const [summary, setSummary] = useState<DailyPaymentSummary>({
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
                getDailyPaymentList(millId, {
                    ...dateParams,
                    limit: 500,
                    sortBy: 'date',
                    sortOrder: 'desc',
                }),
                getDailyPaymentSummary(millId, dateParams),
            ])

            setPayments(listRes.data.dailyPayments || [])
            setSummary(
                summaryRes.data.summary || { totalEntries: 0, totalAmount: 0 }
            )
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message || 'Failed to fetch payment data'
            setError(msg)
            setPayments([])
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
        const filename = `daily-payments${startDate ? `-${startDate}` : ''}${endDate ? `-to-${endDate}` : ''}`
        exportDailyPaymentsAsCsv(payments, filename)
    }, [payments, date])

    // Group payments by payment mode for summary cards
    const byPaymentMode = payments.reduce<
        Record<string, { count: number; total: number }>
    >((acc, p) => {
        if (!acc[p.paymentMode]) acc[p.paymentMode] = { count: 0, total: 0 }
        acc[p.paymentMode].count++
        acc[p.paymentMode].total += p.amount
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
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>
                            {t('dailyReports.payment.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('dailyReports.payment.description')}
                        </p>
                    </div>
                    <div className='flex flex-col items-start gap-2 sm:flex-row sm:items-center'>
                        <DateRangePicker date={date} setDate={setDate} />
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={handleExport}
                            disabled={loading || payments.length === 0}
                            className='w-auto'
                        >
                            <Download className='mr-2 h-4 w-4' />
                            {t('dailyReports.buttons.exportCsv')}
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
                                title={t(
                                    'dailyReports.payment.statsCard.totalPayments'
                                )}
                                value={summary.totalEntries.toString()}
                                icon={Wallet}
                                description={t(
                                    'dailyReports.payment.statsCard.totalPaymentEntries'
                                )}
                            />
                            <StatsCard
                                title={t(
                                    'dailyReports.payment.statsCard.totalAmount'
                                )}
                                value={`₹${summary.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                                icon={IndianRupee}
                                description={t(
                                    'dailyReports.payment.statsCard.totalPaymentAmount'
                                )}
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
                                        description={`${data.count} ${t('dailyReports.payment.statsCard.entries')}`}
                                    />
                                )
                            )}
                        </div>

                        {/* Data Table */}
                        {payments.length === 0 ? (
                            <div className='flex flex-col items-center justify-center py-12 text-muted-foreground'>
                                <ArrowUpRight className='mb-2 h-12 w-12' />
                                <p>{t('dailyReports.payment.emptyMessage')}</p>
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
                                            <TableHead>Ref. No.</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Remarks</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {payments.map((payment) => (
                                            <TableRow key={payment._id}>
                                                <TableCell>
                                                    {typeof payment.date ===
                                                    'string'
                                                        ? payment.date.split(
                                                              'T'
                                                          )[0]
                                                        : format(
                                                              new Date(
                                                                  payment.date
                                                              ),
                                                              'yyyy-MM-dd'
                                                          )}
                                                </TableCell>
                                                <TableCell className='font-mono'>
                                                    {payment.voucherNumber}
                                                </TableCell>
                                                <TableCell>
                                                    {payment.partyName}
                                                </TableCell>
                                                <TableCell className='text-right font-medium'>
                                                    ₹
                                                    {payment.amount.toLocaleString(
                                                        'en-IN',
                                                        {
                                                            minimumFractionDigits: 2,
                                                        }
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {payment.paymentMode}
                                                </TableCell>
                                                <TableCell className='max-w-[150px] truncate'>
                                                    {payment.purpose}
                                                </TableCell>
                                                <TableCell className='font-mono'>
                                                    {payment.referenceNumber ||
                                                        '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant='outline'
                                                        className={
                                                            STATUS_COLORS[
                                                                payment.status
                                                            ] || ''
                                                        }
                                                    >
                                                        {payment.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className='max-w-[150px] truncate'>
                                                    {payment.remarks || '-'}
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
