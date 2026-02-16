import { useCallback, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { ConfigDrawer } from '@/components/config-drawer'
import { DateRangePicker } from '@/components/date-range-picker'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { BrokerTransactionReportTable } from './components/broker-transaction-report-table'
import { useBrokerTransactionReport } from '../data/use-transaction-report'

const formatDateForApi = (d: Date) => format(d, 'yyyy-MM-dd')

export function TransactionBrokerReport() {
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()
    const sidebarData = getMillAdminSidebarData(millId || '')

    const search = Object.fromEntries(searchParams.entries())

    const navigate = useCallback(
        (opts: { search: unknown; replace?: boolean }) => {
            if (typeof opts.search === 'function') {
                const newSearch = (opts.search as (p: Record<string, string>) => Record<string, string>)(search)
                setSearchParams(newSearch as Record<string, string>)
            } else if (opts.search !== true) {
                setSearchParams((opts.search as Record<string, string>) ?? {})
            }
        },
        [search, setSearchParams]
    )

    const dateRange = useMemo((): DateRange | undefined => {
        const from = search.startDate
        const to = search.endDate
        if (from && to) {
            return { from: new Date(from), to: new Date(to) }
        }
        if (from) {
            return { from: new Date(from), to: new Date(from) }
        }
        const now = new Date()
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        return { from: firstOfMonth, to: now }
    }, [search.startDate, search.endDate])

    const setDateRange = useCallback(
        (range: DateRange | undefined) => {
            if (!range?.from) return
            const startDate = formatDateForApi(range.from)
            const endDate = range.to ? formatDateForApi(range.to) : startDate
            navigate({
                search: { ...search, startDate, endDate },
            })
        },
        [search, navigate]
    )

    const { data, pagination, loading, error } = useBrokerTransactionReport(
        millId || '',
        search
    )

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
                            Broker Transaction Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Aggregated from purchase & sales deals by broker
                        </p>
                    </div>
                    <DateRangePicker date={dateRange} setDate={setDateRange} />
                </div>

                {error && (
                    <div className='rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive'>
                        {error}
                    </div>
                )}

                <BrokerTransactionReportTable
                    data={data}
                    search={search}
                    navigate={navigate}
                    loading={loading}
                    serverPagination={pagination}
                />
            </Main>
        </>
    )
}
