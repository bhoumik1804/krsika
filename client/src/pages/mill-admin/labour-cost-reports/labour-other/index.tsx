import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { LabourOtherDialogs } from './components/labour-other-dialogs'
import { LabourOtherPrimaryButtons } from './components/labour-other-primary-buttons'
import { LabourOtherProvider } from './components/labour-other-provider'
import { LabourOtherTable } from './components/labour-other-table'
import { labourOtherEntries } from './data/labour-other-entries'

export function LabourOtherReport() {
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
        <LabourOtherProvider>
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
                            Labour Other Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage labour other transactions and records
                        </p>
                    </div>
                    <LabourOtherPrimaryButtons />
                </div>
                <LabourOtherTable
                    data={labourOtherEntries}
                    search={search}
                    navigate={navigate}
                />
            </Main>

            <LabourOtherDialogs />
        </LabourOtherProvider>
    )
}
