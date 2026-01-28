import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { OtherOutwardDialogs } from './components/other-outward-dialogs'
import { OtherOutwardPrimaryButtons } from './components/other-outward-primary-buttons'
import { OtherOutwardProvider } from './components/other-outward-provider'
import { OtherOutwardTable } from './components/other-outward-table'
import { otherOutwardEntries } from './data/other-outward-entries'

export function OtherOutwardReport() {
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
        <OtherOutwardProvider>
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
                            Other Outward Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage other outward transactions and records
                        </p>
                    </div>
                    <OtherOutwardPrimaryButtons />
                </div>
                <OtherOutwardTable
                    data={otherOutwardEntries}
                    search={search}
                    navigate={navigate}
                />
            </Main>

            <OtherOutwardDialogs />
        </OtherOutwardProvider>
    )
}
