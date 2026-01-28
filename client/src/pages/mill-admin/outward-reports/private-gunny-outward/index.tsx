import { useParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PrivateGunnyOutwardDialogs } from './components/private-gunny-outward-dialogs'
import { PrivateGunnyOutwardPrimaryButtons } from './components/private-gunny-outward-primary-buttons'
import { PrivateGunnyOutwardProvider } from './components/private-gunny-outward-provider'
import { PrivateGunnyOutwardTable } from './components/private-gunny-outward-table'
import { privateGunnyOutwardEntries } from './data/private-gunny-outward-entries'

export function PrivateGunnyOutwardReport() {
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')

    return (
        <PrivateGunnyOutwardProvider>
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
                            Private Gunny Outward Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage private gunny outward transactions
                        </p>
                    </div>
                    <PrivateGunnyOutwardPrimaryButtons />
                </div>
                <PrivateGunnyOutwardTable data={privateGunnyOutwardEntries} />
            </Main>

            <PrivateGunnyOutwardDialogs />
        </PrivateGunnyOutwardProvider>
    )
}
