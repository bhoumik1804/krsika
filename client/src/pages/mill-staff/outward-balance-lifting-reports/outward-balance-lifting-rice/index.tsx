import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { OutwardBalanceLiftingRiceDialogs } from './components/outward-balance-lifting-rice-dialogs'
import { OutwardBalanceLiftingRicePrimaryButtons } from './components/outward-balance-lifting-rice-primary-buttons'
import { OutwardBalanceLiftingRiceProvider } from './components/outward-balance-lifting-rice-provider'
import { OutwardBalanceLiftingRiceTable } from './components/outward-balance-lifting-rice-table'
import { outwardBalanceLiftingRiceEntries } from './data/outward-balance-lifting-rice-entries'

export function OutwardBalanceLiftingRiceReport() {
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
        <OutwardBalanceLiftingRiceProvider>
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
                            Outward Balance Lifting Rice Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage outward balance lifting rice transactions and records
                        </p>
                    </div>
                    <OutwardBalanceLiftingRicePrimaryButtons />
                </div>
                <OutwardBalanceLiftingRiceTable
                    data={outwardBalanceLiftingRiceEntries}
                    search={search}
                    navigate={navigate}
                />
            </Main>

            <OutwardBalanceLiftingRiceDialogs />
        </OutwardBalanceLiftingRiceProvider>
    )
}
