import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillStaffSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { OutwardBalanceLiftingRiceDialogs } from './components/outward-balance-lifting-rice-dialogs'
import { OutwardBalanceLiftingRicePrimaryButtons } from './components/outward-balance-lifting-rice-primary-buttons'
import {
    OutwardBalanceLiftingRiceProvider,
    useOutwardBalanceLiftingRice,
} from './components/outward-balance-lifting-rice-provider'
import { OutwardBalanceLiftingRiceTable } from './components/outward-balance-lifting-rice-table'

export function OutwardBalanceLiftingRiceReport() {
    const { t } = useTranslation('mill-staff')
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()

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
            sortBy: (search.sortBy as any) || 'date',
            sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
        }
    }, [searchParams])

    const sidebarData = getMillStaffSidebarData(millId || '')
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
        <OutwardBalanceLiftingRiceProvider
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
                            {t('outwardRiceSales.balanceLifting.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('outwardRiceSales.balanceLifting.description')}
                        </p>
                    </div>
                    <OutwardBalanceLiftingRicePrimaryButtons />
                </div>
                <OutwardBalanceLiftingRiceContent navigate={navigate} />
            </Main>
            <OutwardBalanceLiftingRiceDialogs />
        </OutwardBalanceLiftingRiceProvider>
    )
}

function OutwardBalanceLiftingRiceContent({
    navigate,
}: {
    navigate: (opts: { search: unknown; replace?: boolean }) => void
}) {
    const { t } = useTranslation('mill-staff')
    const context = useOutwardBalanceLiftingRice()

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
                {t('common.errorLoadingData')}
            </div>
        )
    }

    return (
        <OutwardBalanceLiftingRiceTable
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
