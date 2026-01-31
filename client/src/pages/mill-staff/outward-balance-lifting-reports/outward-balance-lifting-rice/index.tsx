import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { OutwardBalanceLiftingRiceDialogs } from './components/outward-balance-lifting-rice-dialogs'
import { OutwardBalanceLiftingRicePrimaryButtons } from './components/outward-balance-lifting-rice-primary-buttons'
import { OutwardBalanceLiftingRiceProvider } from './components/outward-balance-lifting-rice-provider'
import { OutwardBalanceLiftingRiceTable } from './components/outward-balance-lifting-rice-table'
import { useOutwardBalanceLiftingRiceList } from './data/hooks'
import type { OutwardBalanceLiftingRice } from './data/schema'

export function OutwardBalanceLiftingRiceReport() {
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()
    const sidebarData = getMillAdminSidebarData(millId || '')

    const search = Object.fromEntries(searchParams.entries())

    // Build query params from URL search params
    const queryParams = {
        page: search.page ? parseInt(search.page, 10) : 1,
        limit: search.limit ? parseInt(search.limit, 10) : 10,
        search: search.search || undefined,
        sortBy: search.sortBy || undefined,
        sortOrder: (search.sortOrder as 'asc' | 'desc') || undefined,
        status:
            (search.status as 'pending' | 'completed' | 'cancelled') ||
            undefined,
        startDate: search.startDate || undefined,
        endDate: search.endDate || undefined,
    }

    // Fetch data using React Query hook
    const {
        data: response,
        isLoading,
        isError,
        error,
    } = useOutwardBalanceLiftingRiceList(millId || '', queryParams, {
        enabled: !!millId,
    })

    // Transform API response to table format
    const tableData: OutwardBalanceLiftingRice[] =
        response?.data?.map((item) => ({
            date: item.date,
            partyName: item.partyName,
            vehicleNumber: item.vehicleNumber,
            bags: item.bags,
            weight: item.weight,
            rate: item.rate,
            amount: item.amount,
            status: item.status,
            remarks: item.remarks,
        })) || []

    const navigate = (opts: { search: unknown; replace?: boolean }) => {
        if (typeof opts.search === 'function') {
            const newSearch = opts.search(search)
            setSearchParams(newSearch as Record<string, string>)
        } else if (opts.search === true) {
            // Keep current params
        } else {
            setSearchParams(opts.search as Record<string, string>)
        }
    }

    // Loading state
    if (isLoading) {
        return (
            <OutwardBalanceLiftingRiceProvider>
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
                <Main className='flex flex-1 items-center justify-center'>
                    <LoadingSpinner />
                </Main>
            </OutwardBalanceLiftingRiceProvider>
        )
    }

    // Error state
    if (isError) {
        return (
            <OutwardBalanceLiftingRiceProvider>
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
                <Main className='flex flex-1 flex-col items-center justify-center gap-2'>
                    <p className='text-destructive'>
                        Error loading data: {error?.message || 'Unknown error'}
                    </p>
                </Main>
            </OutwardBalanceLiftingRiceProvider>
        )
    }

    return (
        <OutwardBalanceLiftingRiceProvider>
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
                            Outward Balance Lifting Rice Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage outward balance lifting rice transactions and
                            records
                        </p>
                    </div>
                    <OutwardBalanceLiftingRicePrimaryButtons />
                </div>
                <OutwardBalanceLiftingRiceTable
                    data={tableData}
                    search={search}
                    navigate={navigate}
                />
            </Main>

            <OutwardBalanceLiftingRiceDialogs />
        </OutwardBalanceLiftingRiceProvider>
    )
}
