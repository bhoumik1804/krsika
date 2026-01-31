import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
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
import { balanceLiftingPurchasesPaddyEntries } from './data/balance-lifting-purchases-paddy-entries'

export function BalanceLiftingPurchasesPaddyReport() {
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()
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
        <BalanceLiftingPurchasesPaddyProvider>
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
                            Paddy Purchase Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage paddy purchase transactions and records
                        </p>
                    </div>
                    <BalanceLiftingPurchasesPaddyPrimaryButtons />
                </div>
                <BalanceLiftingPurchasesPaddyTable
                    data={balanceLiftingPurchasesPaddyEntries}
                    search={search}
                    navigate={navigate}
                />
            </Main>

            <BalanceLiftingPurchasesPaddyDialogs />
        </BalanceLiftingPurchasesPaddyProvider>
    )
}
