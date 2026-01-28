import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { LabourInwardDialogs } from './components/labour-inward-dialogs'
import { LabourInwardPrimaryButtons } from './components/labour-inward-primary-buttons'
import { LabourInwardProvider } from './components/labour-inward-provider'
import { LabourInwardTable } from './components/labour-inward-table'
import { labourInwardEntries } from './data/labour-inward-entries'

export function LabourInwardReport() {
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
        <LabourInwardProvider>
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
                            Labour Inward Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage labour inward transactions and records
                        </p>
                    </div>
                    <LabourInwardPrimaryButtons />
                </div>
                <LabourInwardTable
                    data={labourInwardEntries}
                    search={search}
                    navigate={navigate}
                />
            </Main>

            <LabourInwardDialogs />
        </LabourInwardProvider>
    )
}
