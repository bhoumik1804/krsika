import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { BalanceLiftingSalesPaddyDialogs } from './components/balance-lifting-sales-paddy-dialogs'
import { BalanceLiftingSalesPaddyPrimaryButtons } from './components/balance-lifting-sales-paddy-primary-buttons'
import { BalanceLiftingSalesPaddyProvider } from './components/balance-lifting-sales-paddy-provider'
import { BalanceLiftingSalesPaddyTable } from './components/balance-lifting-sales-paddy-table'
import { balanceLiftingSalesPaddyData } from './data/balance-lifting-sales-paddy-entries'

export function BalanceLiftingSalesPaddyReport() {
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()
    const sidebarData = getMillAdminSidebarData(millId || '')

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
        <BalanceLiftingSalesPaddyProvider>
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
                            Paddy Sales Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage paddy sales transactions and records
                        </p>
                    </div>
                    <BalanceLiftingSalesPaddyPrimaryButtons />
                </div>
                <BalanceLiftingSalesPaddyTable
                    data={balanceLiftingSalesPaddyData}
                    search={search}
                    navigate={navigate}
                />
            </Main>

            <BalanceLiftingSalesPaddyDialogs />
        </BalanceLiftingSalesPaddyProvider>
    )
}
