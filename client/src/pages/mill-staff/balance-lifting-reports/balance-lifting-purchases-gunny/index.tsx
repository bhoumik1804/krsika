import { useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { BalanceLiftingPurchasesGunnyDialogs } from './components/balance-lifting-purchases-gunny-dialogs'
import { BalanceLiftingPurchasesGunnyPrimaryButtons } from './components/balance-lifting-purchases-gunny-primary-buttons'
import { BalanceLiftingPurchasesGunnyProvider } from './components/balance-lifting-purchases-gunny-provider'
import { BalanceLiftingPurchasesGunnyTable } from './components/balance-lifting-purchases-gunny-table'
import { useBalanceLiftingPurchasesGunnyList } from './data/hooks'

export function BalanceLiftingPurchasesGunnyReport() {
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

    const { data: response } = useBalanceLiftingPurchasesGunnyList(
        millId || '',
        queryParams,
        {
            enabled: !!millId,
        }
    )

    const balanceLiftingPurchasesGunnyData = useMemo(() => {
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
        <BalanceLiftingPurchasesGunnyProvider>
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
                            Gunny Purchase Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage gunny purchase transactions and records
                        </p>
                    </div>
                    <BalanceLiftingPurchasesGunnyPrimaryButtons />
                </div>
                <BalanceLiftingPurchasesGunnyTable
                    data={balanceLiftingPurchasesGunnyData}
                    search={search}
                    navigate={navigate}
                />
            </Main>

            <BalanceLiftingPurchasesGunnyDialogs />
        </BalanceLiftingPurchasesGunnyProvider>
    )
}
