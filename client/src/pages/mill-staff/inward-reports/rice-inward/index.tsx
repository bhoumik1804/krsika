import { useMemo } from 'react'
import { useRiceInwardList } from '@/pages/mill-staff/inwards/rice-inward/data/hooks'
import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RiceInwardDialogs } from './components/rice-inward-dialogs'
import { RiceInwardPrimaryButtons } from './components/rice-inward-primary-buttons'
import { RiceInwardProvider } from './components/rice-inward-provider'
import { RiceInwardTable } from './components/rice-inward-table'

export function RiceInwardReport() {
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()
    const sidebarData = getMillAdminSidebarData(millId || '')

    const search = Object.fromEntries(searchParams.entries())

    // Extract query params from URL
    const queryParams = useMemo(
        () => ({
            page: search.page ? parseInt(search.page as string, 10) : 1,
            limit: search.limit ? parseInt(search.limit as string, 10) : 10,
            search: search.search as string | undefined,
            startDate: search.startDate as string | undefined,
            endDate: search.endDate as string | undefined,
            sortBy: (search.sortBy as string) || 'date',
            sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
        }),
        [search]
    )

    // Fetch rice inward data using the hook
    const {
        data: inwardResponse,
        isLoading,
        isError,
    } = useRiceInwardList(millId || '', queryParams, { enabled: !!millId })

    // Transform API response to table format
    const inwardData = useMemo(() => {
        if (!inwardResponse?.data) return []
        return inwardResponse.data.map((item) => ({
            id: item._id,
            date: item.date,
            partyName: item.partyName ?? '',
            riceType: item.riceType ?? '',
            truckNumber: item.truckNumber ?? '',
            riceGunny: item.riceGunny ?? 0,
            frk: item.frk ?? 0,
            sampleWeight: item.sampleWeight ?? 0,
            grossWeight: item.grossWeight ?? 0,
            tareWeight: item.tareWeight ?? 0,
            netWeight: item.netWeight ?? 0,
            brokerName: item.brokerName ?? '',
        }))
    }, [inwardResponse])

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

    return (
        <RiceInwardProvider>
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
                            Rice Inward / LOT Deposit Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage rice inward transactions and records
                        </p>
                    </div>
                    <RiceInwardPrimaryButtons />
                </div>
                {isLoading ? (
                    <div className='flex items-center justify-center py-10'>
                        <LoadingSpinner />
                    </div>
                ) : isError ? (
                    <div className='py-10 text-center text-destructive'>
                        Failed to load rice inward data
                    </div>
                ) : (
                    <RiceInwardTable
                        data={inwardData}
                        search={search}
                        navigate={navigate}
                    />
                )}
            </Main>

            <RiceInwardDialogs />
        </RiceInwardProvider>
    )
}
