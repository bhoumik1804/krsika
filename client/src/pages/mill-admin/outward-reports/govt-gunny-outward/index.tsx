import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { GovtGunnyOutwardDialogs } from './components/govt-gunny-outward-dialogs'
import { GovtGunnyOutwardPrimaryButtons } from './components/govt-gunny-outward-primary-buttons'
import { GovtGunnyOutwardProvider } from './components/govt-gunny-outward-provider'
import { GovtGunnyOutwardTable } from './components/govt-gunny-outward-table'
import { govtGunnyOutwardEntries } from './data/govt-gunny-outward-entries'

export function GovtGunnyOutwardReport() {
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
        <GovtGunnyOutwardProvider>
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
                            Govt Gunny Outward Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage government gunny outward transactions
                        </p>
                    </div>
                    <GovtGunnyOutwardPrimaryButtons />
                </div>
                <GovtGunnyOutwardTable
                    data={govtGunnyOutwardEntries}
                    search={search}
                    navigate={navigate}
                />
            </Main>

            <GovtGunnyOutwardDialogs />
        </GovtGunnyOutwardProvider>
    )
}
