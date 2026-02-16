import { useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { BalanceLiftingPurchasesFrkDialogs } from './components/balance-lifting-purchases-frk-dialogs'
import { BalanceLiftingPurchasesFrkPrimaryButtons } from './components/balance-lifting-purchases-frk-primary-buttons'
import {
    BalanceLiftingPurchasesFrkProvider,
    useBalanceLiftingPurchasesFrk,
} from './components/balance-lifting-purchases-frk-provider'
import { BalanceLiftingPurchasesFrkTable } from './components/balance-lifting-purchases-frk-table'

export function BalanceLiftingPurchasesFrkReport() {
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()
    const { t } = useTranslation()

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

    return (
        <BalanceLiftingPurchasesFrkProvider
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
                            {t('balanceLiftingFrkPurchase.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('balanceLiftingFrkPurchase.description')}
                        </p>
                    </div>
                    <BalanceLiftingPurchasesFrkPrimaryButtons />
                </div>
                <BalanceLiftingPurchasesFrkContent navigate={navigate} />
            </Main>

            <BalanceLiftingPurchasesFrkDialogs />
        </BalanceLiftingPurchasesFrkProvider>
    )
}

// Separate component to use context hook
function BalanceLiftingPurchasesFrkContent({
    navigate,
}: {
    navigate: (opts: { search: unknown; replace?: boolean }) => void
}) {
    const context = useBalanceLiftingPurchasesFrk()

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
        <BalanceLiftingPurchasesFrkTable
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
