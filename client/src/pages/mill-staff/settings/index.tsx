import { Palette, UserCog } from 'lucide-react'
import { Outlet, useParams } from 'react-router'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillStaffSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { SidebarNav } from './components/sidebar-nav'

export function MillStaffSettings({
    children,
}: {
    children?: React.ReactNode
}) {
    const { millId } = useParams<{ millId: string; staffId: string }>()
    const sidebarData = getMillStaffSidebarData(millId || '')

    const sidebarNavItems = [
        {
            title: 'Profile',
            href: `/staff/${millId}/settings`,
            icon: <UserCog size={18} />,
        },
        {
            title: 'Appearance',
            href: `/staff/${millId}/settings/appearance`,
            icon: <Palette size={18} />,
        },
    ]

    return (
        <>
            <Header>
                <div className='flex items-center gap-2'>
                    <UserCog className='h-5 w-5' />
                    <h1 className='text-lg font-semibold'>Settings</h1>
                </div>
                <div className='ms-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown
                        user={sidebarData.user}
                        links={sidebarData.profileLinks}
                    />
                </div>
            </Header>

            <Main fixed>
                <div className='space-y-0.5'>
                    <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
                        Settings
                    </h1>
                    <p className='text-muted-foreground'>
                        Manage your account and preferences.
                    </p>
                </div>
                <Separator className='my-4 lg:my-6' />
                <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
                    <aside className='top-0 lg:sticky lg:w-1/5'>
                        <SidebarNav items={sidebarNavItems} />
                    </aside>
                    <div className='flex w-full overflow-y-hidden p-1'>
                        {children ?? <Outlet />}
                    </div>
                </div>
            </Main>
        </>
    )
}
