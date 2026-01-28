import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { StockOverviewDialogs } from './components/stock-overview-dialogs'
import { StockOverviewPrimaryButtons } from './components/stock-overview-primary-buttons'
import { StockOverviewProvider } from './components/stock-overview-provider'
import { StockOverviewTable } from './components/stock-overview-table'
import { stockOverviewEntries } from './data/stock-overview-entries'

export function StockOverviewReport() {
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
        <StockOverviewProvider>
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
                            Stock Overview Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage stock overview transactions and records
                        </p>
                    </div>
                    <StockOverviewPrimaryButtons />
                </div>
                <StockOverviewTable
                    data={stockOverviewEntries}
                    search={search}
                    navigate={navigate}
                />
            </Main>

            <StockOverviewDialogs />
        </StockOverviewProvider>
    )
}
