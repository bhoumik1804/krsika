import { Palette, UserCog } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Outlet, useParams } from 'react-router'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitch } from '@/components/language-switch'
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
    const { t } = useTranslation()
    const { millId } = useParams<{ millId: string; staffId: string }>()
    const sidebarData = getMillStaffSidebarData(millId || '')

    const sidebarNavItems = [
        {
            title: t('settings.profile'),
            href: `/staff/${millId}/settings`,
            icon: <UserCog size={18} />,
        },
        {
            title: t('settings.appearance'),
            href: `/staff/${millId}/settings/appearance`,
            icon: <Palette size={18} />,
        },
    ]

    return (
        <>
            <Header>
                <div className='flex items-center gap-2'>
                    <UserCog className='h-5 w-5' />
                    <h1 className='text-lg font-semibold'>
                        {t('settings.title')}
                    </h1>
                </div>
                <div className='ms-auto flex items-center space-x-4'>
                    <LanguageSwitch />
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
                        {t('settings.title')}
                    </h1>
                    <p className='text-muted-foreground'>
                        {t('settings.subtitle')}
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
