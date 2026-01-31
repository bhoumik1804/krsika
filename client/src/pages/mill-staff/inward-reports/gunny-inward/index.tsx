import { useMemo } from 'react'
import { useGunnyInwardList } from '@/pages/mill-staff/inwards/gunny-inward/data/hooks'
import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { GunnyInwardDialogs } from './components/gunny-inward-dialogs'
import { GunnyInwardPrimaryButtons } from './components/gunny-inward-primary-buttons'
import { GunnyInwardProvider } from './components/gunny-inward-provider'
import { GunnyInwardTable } from './components/gunny-inward-table'

export function GunnyInwardReport() {
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

    // Fetch gunny inward data using the hook
    const {
        data: inwardResponse,
        isLoading,
        isError,
    } = useGunnyInwardList(millId || '', queryParams, { enabled: !!millId })

    // Transform API response to table format
    const inwardData = useMemo(() => {
        if (!inwardResponse?.data) return []
        return inwardResponse.data.map((item) => ({
            id: item._id,
            date: item.date,
            partyName: item.partyName ?? '',
            gunnyType: item.gunnyType ?? '',
            totalGunny: item.totalGunny ?? 0,
            rate: item.rate ?? 0,
            amount: item.amount ?? 0,
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
        <GunnyInwardProvider>
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
                            Gunny Inward / Samiti-Sangrahan Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage gunny inward transactions and records
                        </p>
                    </div>
                    <GunnyInwardPrimaryButtons />
                </div>
                {isLoading ? (
                    <div className='flex items-center justify-center py-10'>
                        <LoadingSpinner />
                    </div>
                ) : isError ? (
                    <div className='py-10 text-center text-destructive'>
                        Failed to load gunny inward data
                    </div>
                ) : (
                    <GunnyInwardTable
                        data={inwardData}
                        search={search}
                        navigate={navigate}
                    />
                )}
            </Main>

            <GunnyInwardDialogs />
        </GunnyInwardProvider>
    )
}
