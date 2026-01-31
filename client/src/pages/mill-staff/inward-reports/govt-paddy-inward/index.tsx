import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { ConfigDrawer } from '@/components/config-drawer';
import { getMillAdminSidebarData } from '@/components/layout/data';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { LoadingSpinner } from '@/components/loading-spinner';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { GovtPaddyInwardDialogs } from './components/govt-paddy-inward-dialogs';
import { GovtPaddyInwardPrimaryButtons } from './components/govt-paddy-inward-primary-buttons';
import { GovtPaddyInwardProvider } from './components/govt-paddy-inward-provider';
import { GovtPaddyInwardTable } from './components/govt-paddy-inward-table';
import { useGovtPaddyInwardList } from './data/hooks';


















export function GovtPaddyInwardReport() {
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

    // Fetch govt paddy inward data using the hook
    const {
        data: inwardResponse,
        isLoading,
        isError,
    } = useGovtPaddyInwardList(millId || '', queryParams, { enabled: !!millId })

    // Transform API response to table format
    const inwardData = useMemo(() => {
        if (!inwardResponse?.data) return []
        return inwardResponse.data.map((item) => ({
            id: item._id,
            date: item.date,
            doNumber: item.doNumber,
            committeeName: item.committeeName,
            balanceDo: item.balanceDo ?? 0,
            gunnyNew: item.gunnyNew ?? 0,
            gunnyOld: item.gunnyOld ?? 0,
            gunnyPlastic: item.gunnyPlastic ?? 0,
            juteWeight: item.juteWeight ?? 0,
            plasticWeight: item.plasticWeight ?? 0,
            gunnyWeight: item.gunnyWeight ?? 0,
            truckNumber: item.truckNumber,
            rstNumber: item.rstNumber ?? '',
            truckLoadWeight: item.truckLoadWeight ?? 0,
            paddyType: item.paddyType ?? '',
            paddyMota: item.paddyMota ?? 0,
            paddyPatla: item.paddyPatla ?? 0,
            paddySarna: item.paddySarna ?? 0,
            paddyMahamaya: item.paddyMahamaya ?? 0,
            paddyRbGold: item.paddyRbGold ?? 0,
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
        <GovtPaddyInwardProvider>
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
                            Govt Paddy Inward Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage paddy inward transactions and records
                        </p>
                    </div>
                    <GovtPaddyInwardPrimaryButtons />
                </div>
                {isLoading ? (
                    <LoadingSpinner className='h-full w-full' />
                ) : isError ? (
                    <div className='py-10 text-center text-destructive'>
                        Failed to load govt paddy inward data
                    </div>
                ) : (
                    <GovtPaddyInwardTable
                        data={inwardData}
                        search={search}
                        navigate={navigate}
                    />
                )}
            </Main>

            <GovtPaddyInwardDialogs />
        </GovtPaddyInwardProvider>
    )
}
