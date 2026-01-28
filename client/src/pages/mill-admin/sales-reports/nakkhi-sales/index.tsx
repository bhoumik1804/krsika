import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { NakkhiSalesDialogs } from './components/nakkhi-sales-dialogs'
import { NakkhiSalesPrimaryButtons } from './components/nakkhi-sales-primary-buttons'
import { NakkhiSalesProvider } from './components/nakkhi-sales-provider'
import { NakkhiSalesTable } from './components/nakkhi-sales-table'
import { nakkhiSalesEntries } from './data/nakkhi-sales-entries'

export function NakkhiSalesReport() {
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
        <NakkhiSalesProvider>
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
                            Nakkhi Sales Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage nakkhi sales transactions and records
                        </p>
                    </div>
                    <NakkhiSalesPrimaryButtons />
                </div>
                <NakkhiSalesTable
                    data={nakkhiSalesEntries}
                    search={search}
                    navigate={navigate}
                />
            </Main>

            <NakkhiSalesDialogs />
        </NakkhiSalesProvider>
    )
}
