import { useParams, useSearchParams } from 'react-router'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { FrkOutwardDialogs } from './components/frk-outward-dialogs'
import { FrkOutwardPrimaryButtons } from './components/frk-outward-primary-buttons'
import { FrkOutwardProvider } from './components/frk-outward-provider'
import { FrkOutwardTable } from './components/frk-outward-table'
import { useFrkOutwardList } from './data/hooks'
import type { FrkOutwardQueryParams } from './data/types'

function FrkOutwardContent() {
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()

    if (!millId) {
        return (
            <Main className='flex flex-1 items-center justify-center'>
                <div className='text-center'>
                    <p className='text-destructive'>Mill ID is missing</p>
                </div>
            </Main>
        )
    }

    // Convert search params to record for useTableUrlState
    const search = Object.fromEntries(searchParams.entries())

    const queryParams: FrkOutwardQueryParams = {
        page: Number(searchParams.get('page')) || 1,
        limit: Number(searchParams.get('limit')) || 10,
        search: searchParams.get('partyName') || undefined,
        partyName: searchParams.get('partyName') || undefined,
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined,
        sortBy: searchParams.get('sortBy') || undefined,
        sortOrder:
            (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
    }

    const { data, isLoading, error } = useFrkOutwardList(millId, queryParams)

    const navigate: NavigateFn = (opts) => {
        if (typeof opts.search === 'function') {
            const current = Object.fromEntries(searchParams.entries())
            const updates = opts.search(current)
            setSearchParams(updates as Record<string, string>, {
                replace: opts.replace,
            })
        } else if (opts.search === true) {
            // Do nothing if search is true
        } else {
            setSearchParams(opts.search as Record<string, string>, {
                replace: opts.replace,
            })
        }
    }

    if (isLoading) {
        return (
            <Main className='flex flex-1 items-center justify-center'>
                <LoadingSpinner />
            </Main>
        )
    }

    if (error) {
        return (
            <Main className='flex flex-1 items-center justify-center'>
                <div className='text-center'>
                    <p className='text-destructive'>Failed to load data</p>
                    <p className='text-sm text-muted-foreground'>
                        {error.message}
                    </p>
                </div>
            </Main>
        )
    }

    return (
        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
            <div className='flex flex-wrap items-end justify-between gap-2'>
                <div>
                    <h2 className='text-2xl font-bold tracking-tight'>
                        FRK Outward Report
                    </h2>
                    <p className='text-muted-foreground'>
                        Manage FRK outward transactions and records
                    </p>
                </div>
                <FrkOutwardPrimaryButtons />
            </div>
            <FrkOutwardTable
                data={data?.entries || []}
                search={search}
                navigate={navigate}
                serverPagination={data?.pagination}
            />
        </Main>
    )
}

export function FrkOutwardReport() {
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')

    return (
        <FrkOutwardProvider millId={millId!}>
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

            <FrkOutwardContent />

            <FrkOutwardDialogs />
        </FrkOutwardProvider>
    )
}
