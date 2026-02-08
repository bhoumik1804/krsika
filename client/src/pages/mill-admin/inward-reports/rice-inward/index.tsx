import { useMemo } from 'react'
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
import { useRiceInwardList } from './data/hooks'
import type { RiceInwardQueryParams } from './data/types'

function RiceInwardContent({ millId }: { millId: string }) {
    const [searchParams, setSearchParams] = useSearchParams()

    const search = Object.fromEntries(searchParams.entries())

    const queryParams: RiceInwardQueryParams = useMemo(() => {
        const allowedPageSizes = [10, 20, 30, 40, 50]
        const rawLimit = search.limit
            ? parseInt(search.limit as string, 10)
            : 10
        const limit = allowedPageSizes.includes(rawLimit) ? rawLimit : 10

        return {
            page: search.page ? parseInt(search.page as string, 10) : 1,
            limit,
            search: search.search as string | undefined,
            sortBy: search.sortBy as string | undefined,
            sortOrder: search.sortOrder as 'asc' | 'desc' | undefined,
        }
    }, [search])

    const {
        data: listData,
        isLoading,
        error,
    } = useRiceInwardList(millId, queryParams)

    const data = listData?.entries ?? []
    const pagination = listData?.pagination

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

    if (error) {
        return (
            <Main className='flex flex-1 flex-col items-center justify-center'>
                <div className='text-center'>
                    <h2 className='text-2xl font-bold text-destructive'>
                        Error loading data
                    </h2>
                    <p className='mt-2 text-muted-foreground'>
                        {error.message || 'Failed to load rice inward records'}
                    </p>
                </div>
            </Main>
        )
    }

    return (
        <>
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
                    <div className='flex items-center justify-center py-8'>
                        <LoadingSpinner />
                    </div>
                ) : (
                    <RiceInwardTable
                        data={data}
                        search={search}
                        navigate={navigate}
                        pagination={pagination}
                    />
                )}
            </Main>

            <RiceInwardDialogs />
        </>
    )
}

export function RiceInwardReport() {
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')

    if (!millId) {
        return (
            <Main className='flex flex-1 flex-col items-center justify-center'>
                <div className='text-center'>
                    <h2 className='text-2xl font-bold text-destructive'>
                        Mill ID is required
                    </h2>
                </div>
            </Main>
        )
    }

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

            <RiceInwardProvider millId={millId}>
                <RiceInwardContent millId={millId} />
            </RiceInwardProvider>
        </>
    )
}
