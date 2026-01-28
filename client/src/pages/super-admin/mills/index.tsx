import { useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { superAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { MillsDialogs } from './components/mills-dialogs'
import { MillsPrimaryButtons } from './components/mills-primary-buttons'
import { MillsProvider } from './components/mills-provider'
import { MillsTable } from './components/mills-table'
import { mills } from './data/mills'

export function Mills() {
    const [searchParams, setSearchParams] = useSearchParams()

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
        <MillsProvider>
            <Header fixed>
                <Search />
                <div className='ms-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown
                        user={superAdminSidebarData.user}
                        links={superAdminSidebarData.profileLinks}
                    />
                </div>
            </Header>

            <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>
                            Mills List
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage your mills and their operations here.
                        </p>
                    </div>
                    <MillsPrimaryButtons />
                </div>
                <MillsTable data={mills} search={search} navigate={navigate} />
            </Main>

            <MillsDialogs />
        </MillsProvider>
    )
}
