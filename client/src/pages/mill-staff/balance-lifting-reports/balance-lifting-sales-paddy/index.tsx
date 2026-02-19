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
import { BalanceLiftingSalesPaddyDialogs } from './components/balance-lifting-sales-paddy-dialogs'
import { BalanceLiftingSalesPaddyPrimaryButtons } from './components/balance-lifting-sales-paddy-primary-buttons'
import {
    BalanceLiftingSalesPaddyProvider,
    useBalanceLiftingSalesPaddy,
} from './components/balance-lifting-sales-paddy-provider'
import { BalanceLiftingSalesPaddyTable } from './components/balance-lifting-sales-paddy-table'

export function BalanceLiftingSalesPaddyReport() {
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
            sortBy: (search.sortBy as string) || 'date',
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

    return (
        <BalanceLiftingSalesPaddyProvider
            millId={millId || ''}
            initialQueryParams={queryParams}
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
                            Paddy Sale Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage paddy sales transactions and records
                        </p>
                    </div>
                    <BalanceLiftingSalesPaddyPrimaryButtons />
                </div>
                <BalanceLiftingSalesPaddyContent navigate={navigate} />
            </Main>
            <BalanceLiftingSalesPaddyDialogs />
        </BalanceLiftingSalesPaddyProvider>
    )
}

// Separate component to use context hook
function BalanceLiftingSalesPaddyContent({
    navigate,
}: {
    navigate: (opts: { search: unknown; replace?: boolean }) => void
}) {
    const context = useBalanceLiftingSalesPaddy()

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
                Failed to load Paddy sales data. Please try again later.
            </div>
        )
    }

    return (
        <BalanceLiftingSalesPaddyTable
            data={context.data}
            pagination={context.pagination}
            search={Object.fromEntries(
                Object.entries(context.queryParams || {})
                    .filter(([, value]) => value !== undefined)
                    .map(([key, value]) => [key, String(value)])
            )}
            navigate={navigate}
        />
    )
}
