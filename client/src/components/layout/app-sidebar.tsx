import { ROLE_DISPLAY_NAMES } from '@/constants'
import { cn } from '@/lib/utils'
import { useLayout } from '@/context/layout-provider'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    useSidebar,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { type SidebarData } from './types'

interface AppSidebarProps {
    sidebarData: SidebarData
}

export function AppSidebar({ sidebarData }: AppSidebarProps) {
    const { collapsible, variant } = useLayout()
    const { state } = useSidebar()

    const isCollapsed = state === 'collapsed'

    return (
        <Sidebar collapsible={collapsible} variant={variant}>
            <SidebarHeader className='border-sidebar-border'>
                {/* Logo/Brand Section */}
                <div
                    className={cn(
                        'flex items-center gap-2 px-2 py-3 transition-all',
                        isCollapsed ? 'justify-center' : 'justify-start'
                    )}
                >
                    <Avatar className='size-9'>
                        <AvatarFallback className='p-0.5'>
                            {isCollapsed ? 'M' : 'MS'}
                        </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                        <div className='flex flex-col'>
                            <span className='text-sm font-semibold'>
                                Mill System
                            </span>
                            <span className='text-xs text-muted-foreground'>
                                {sidebarData.user?.role
                                    ? ROLE_DISPLAY_NAMES[sidebarData.user.role]
                                    : 'Dashboard'}
                            </span>
                        </div>
                    )}
                </div>
            </SidebarHeader>
            <SidebarContent>
                {sidebarData.navGroups.map((props) => (
                    <NavGroup key={props.title} {...props} />
                ))}
            </SidebarContent>
            <SidebarFooter>
                <NavUser
                    user={sidebarData.user}
                    links={sidebarData.profileLinks}
                />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
