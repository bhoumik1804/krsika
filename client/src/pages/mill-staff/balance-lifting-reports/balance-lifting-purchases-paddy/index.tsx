import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitch } from '@/components/language-switch'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { BalanceLiftingPurchasesPaddyDialogs } from './components/balance-lifting-purchases-paddy-dialogs'
import { BalanceLiftingPurchasesPaddyPrimaryButtons } from './components/balance-lifting-purchases-paddy-primary-buttons'
import { BalanceLiftingPurchasesPaddyProvider } from './components/balance-lifting-purchases-paddy-provider'
import { BalanceLiftingPurchasesPaddyTable } from './components/balance-lifting-purchases-paddy-table'
import { useBalanceLiftingPurchasesPaddyList } from './data/hooks'

export function BalanceLiftingPurchasesPaddyReport() {
    const { t } = useTranslation('millStaff')
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()
    const sidebarData = getMillAdminSidebarData(millId || '')

    const search = Object.fromEntries(searchParams.entries())

    const queryParams = useMemo(
        () => ({
            page: search.page ? parseInt(search.page as string, 10) : 1,
            limit: search.limit ? parseInt(search.limit as string, 10) : 10,
            search: search.search as string | undefined,
            sortBy: (search.sortBy as string) || 'createdAt',
            sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
        }),
        [search]
    )

    const { data: response } = useBalanceLiftingPurchasesPaddyList(
        millId || '',
        queryParams,
        {
            enabled: !!millId,
        }
    )

    const balanceLiftingPurchasesPaddyData = useMemo(() => {
        if (!response?.data) return []
        return response.data.map((item) => ({
            id: item._id,
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
        }))
    }, [response])

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
        <BalanceLiftingPurchasesPaddyProvider>
            <Header fixed>
                <Search />
                <div className='ms-auto flex items-center space-x-4'>
                    <LanguageSwitch />
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
                            {t(
                                'reports.balanceLiftingReports.purchasesPaddy.title'
                            )}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t(
                                'reports.balanceLiftingReports.purchasesPaddy.subtitle'
                            )}
                        </p>
                    </div>
                    <BalanceLiftingPurchasesPaddyPrimaryButtons />
                </div>
                <BalanceLiftingPurchasesPaddyTable
                    data={balanceLiftingPurchasesPaddyData}
                    search={search}
                    navigate={navigate}
                />
            </Main>

            <BalanceLiftingPurchasesPaddyDialogs />
        </BalanceLiftingPurchasesPaddyProvider>
    )
}
