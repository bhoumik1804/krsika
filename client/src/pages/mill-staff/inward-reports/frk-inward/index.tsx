import { useMemo } from 'react';
import { useFrkInwardList } from '@/pages/mill-staff/inwards/frk-inward/data/hooks';
import { useParams, useSearchParams } from 'react-router';
import { ConfigDrawer } from '@/components/config-drawer';
import { getMillAdminSidebarData } from '@/components/layout/data';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { LoadingSpinner } from '@/components/loading-spinner';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { FrkInwardDialogs } from './components/frk-inward-dialogs';
import { FrkInwardPrimaryButtons } from './components/frk-inward-primary-buttons';
import { FrkInwardProvider } from './components/frk-inward-provider';
import { FrkInwardTable } from './components/frk-inward-table';


















export function FrkInwardReport() {
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

    // Fetch FRK inward data using the hook
    const {
        data: inwardResponse,
        isLoading,
        isError,
    } = useFrkInwardList(millId || '', queryParams, { enabled: !!millId })

    // Transform API response to table format
    const inwardData = useMemo(() => {
        if (!inwardResponse?.data) return []
        return inwardResponse.data.map((item) => ({
            id: item._id,
            date: item.date,
            partyName: item.partyName ?? '',
            totalWeight: item.totalWeight ?? 0,
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
        <FrkInwardProvider>
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
                            FRK Inward Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage FRK inward transactions and records
                        </p>
                    </div>
                    <FrkInwardPrimaryButtons />
                </div>
                {isLoading ? (
                    <LoadingSpinner className='h-full w-full' />
                ) : isError ? (
                    <div className='py-10 text-center text-destructive'>
                        Failed to load FRK inward data
                    </div>
                ) : (
                    <FrkInwardTable
                        data={inwardData}
                        search={search}
                        navigate={navigate}
                    />
                )}
            </Main>

            <FrkInwardDialogs />
        </FrkInwardProvider>
    )
}
