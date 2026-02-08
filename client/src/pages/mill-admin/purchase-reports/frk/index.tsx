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
import { FrkDialogs } from './components/frk-dialogs'
import { FrkPrimaryButtons } from './components/frk-primary-buttons'
import { FrkProvider, useFrk } from './components/frk-provider'
import { FrkTable } from './components/frk-table'

export function FrkPurchaseReport() {
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()

    // Extract query params from URL
    const queryParams = useMemo(() => {
        const search = Object.fromEntries(searchParams.entries())
        const allowedPageSizes = [10, 20, 30, 40, 50]
        const rawLimit = search.limit
            ? parseInt(search.limit as string, 10)
            : 10
        const limit = allowedPageSizes.includes(rawLimit) ? rawLimit : 10

        return {
            page: search.page ? parseInt(search.page as string, 10) : 1,
            limit,
            search: search.search as string | undefined,
            sortBy: (search.sortBy as string) || 'createdAt',
            sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
        }
    }, [searchParams])

    const sidebarData = getMillAdminSidebarData(millId || '')

    // Convert URLSearchParams to record
    const search = Object.fromEntries(searchParams.entries())

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

    const handleQueryParamsChange = (params: {
        page: number
        limit: number
        search?: string
        sortBy?: string
        sortOrder?: 'asc' | 'desc'
    }) => {
        const newParams: Record<string, string> = {
            page: params.page.toString(),
            limit: params.limit.toString(),
        }
        if (params.search) {
            newParams.search = params.search
        }
        if (params.sortBy) {
            newParams.sortBy = params.sortBy
        }
        if (params.sortOrder) {
            newParams.sortOrder = params.sortOrder
        }
        setSearchParams(newParams, { replace: true })
    }

    return (
        <FrkProvider
            millId={millId || ''}
            initialQueryParams={queryParams}
            onQueryParamsChange={handleQueryParamsChange}
        >
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
                            FRK Purchase Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage FRK purchase transactions and records
                        </p>
                    </div>
                    <FrkPrimaryButtons />
                </div>
                <FrkPurchaseContent navigate={navigate} />
            </Main>

            <FrkDialogs />
        </FrkProvider>
    )
}

// Separate component to use context hook
function FrkPurchaseContent({
    navigate,
}: {
    navigate: (opts: { search: unknown; replace?: boolean }) => void
}) {
    const context = useFrk()

    if (context.isLoading) {
        return (
            <div className='flex items-center justify-center py-10'>
                <LoadingSpinner />
            </div>
        )
    }

    if (context.isError) {
        return (
            <div className='py-10 text-center text-red-500'>
                Failed to load FRK purchase data. Please try again later.
            </div>
        )
    }

    return (
        <FrkTable
            data={context.data}
            search={Object.fromEntries(
                Object.entries(context.queryParams || {})
                    .filter(([, value]) => value !== undefined)
                    .map(([key, value]) => [key, String(value)])
            )}
            navigate={navigate}
        />
    )
}
