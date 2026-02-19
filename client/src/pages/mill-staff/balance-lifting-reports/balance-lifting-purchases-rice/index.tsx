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
import { BalanceLiftingPurchasesRiceDialogs } from './components/balance-lifting-purchases-rice-dialogs'
import { BalanceLiftingPurchasesRicePrimaryButtons } from './components/balance-lifting-purchases-rice-primary-buttons'
import {
    BalanceLiftingPurchasesRiceProvider,
    useBalanceLiftingPurchasesRice,
} from './components/balance-lifting-purchases-rice-provider'
import { BalanceLiftingPurchasesRiceTable } from './components/balance-lifting-purchases-rice-table'

import { useTranslation } from 'react-i18next'
// ...

export function BalanceLiftingPurchasesRiceReport() {
    const { t } = useTranslation('mill-staff')
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()

    const queryParams = useMemo(() => {
        const s = Object.fromEntries(searchParams.entries())
        const allowedPageSizes = [10, 20, 30, 40, 50]
        const rawLimit = s.limit ? parseInt(s.limit as string, 10) : 10
        const limit = allowedPageSizes.includes(rawLimit) ? rawLimit : 10

        return {
            page: s.page ? parseInt(s.page as string, 10) : 1,
            limit,
            search: (s.partyName || s.search) as string | undefined,
        }
    }, [searchParams])

    const sidebarData = getMillAdminSidebarData(millId || '')
    const search = Object.fromEntries(searchParams.entries())

    const navigate = (opts: { search: unknown; replace?: boolean }) => {
        if (typeof opts.search === 'function') {
            const newSearch = (opts.search as (p: Record<string, string>) => Record<string, string>)(search)
            setSearchParams(newSearch as Record<string, string>)
        } else if (opts.search !== true) {
            setSearchParams((opts.search as Record<string, string>) ?? {})
        }
    }

    return (
        <BalanceLiftingPurchasesRiceProvider
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
                            {t('balanceLifting.purchase.rice.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('balanceLifting.purchase.rice.description')}
                        </p>
                    </div>
                    <BalanceLiftingPurchasesRicePrimaryButtons />
                </div>
                <BalanceLiftingPurchasesRiceContent navigate={navigate} />
            </Main>

            <BalanceLiftingPurchasesRiceDialogs />
        </BalanceLiftingPurchasesRiceProvider>
    )
}

function BalanceLiftingPurchasesRiceContent({
    navigate,
}: {
    navigate: (opts: { search: unknown; replace?: boolean }) => void
}) {
    const { t } = useTranslation('mill-staff')
    const ctx = useBalanceLiftingPurchasesRice()

    if (ctx.isLoading) {
        return (
            <div className='flex items-center justify-center py-10'>
                <LoadingSpinner />
            </div>
        )
    }

    if (ctx.isError) {
        return (
            <div className='py-10 text-center text-red-500'>
                {t('common.errorLoadingData')}
            </div>
        )
    }

    const searchRecord: Record<string, string> = {}
    if (ctx.queryParams?.page) searchRecord.page = String(ctx.queryParams.page)
    if (ctx.queryParams?.limit) searchRecord.limit = String(ctx.queryParams.limit)
    if (ctx.queryParams?.search) searchRecord.partyName = ctx.queryParams.search

    return (
        <BalanceLiftingPurchasesRiceTable
            data={ctx.data}
            pagination={ctx.pagination}
            search={searchRecord}
            navigate={navigate}
        />
    )
}
