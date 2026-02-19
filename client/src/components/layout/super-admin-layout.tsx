import { Outlet } from 'react-router'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { superAdminSidebarData } from '@/components/layout/data'

type SuperAdminLayoutProps = {
    children?: React.ReactNode
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
    const defaultOpen = getCookie('sidebar_state') !== 'false'
    const user = useAuthStore((state) => state.user)
    let sidebarData = superAdminSidebarData
    
    // Override with actual user data if logged in
    if (user) {
        sidebarData = {
            ...sidebarData,
            user: {
                name: user.fullName || 'Guest User',
                email: user.email || 'guest@example.com',
                avatar: user.fullName || 'Guest User',
                role: user.role,
            },
        }
    }
    
    return (
        <SearchProvider sidebarData={sidebarData}>
            <LayoutProvider>
                <SidebarProvider defaultOpen={defaultOpen}>
                    <AppSidebar sidebarData={superAdminSidebarData} />
                    <SidebarInset
                        className={cn(
                            '@container/content',
                            'has-data-[layout=fixed]:h-svh',
                            'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
                        )}
                    >
                        {children ?? <Outlet />}
                    </SidebarInset>
                </SidebarProvider>
            </LayoutProvider>
        </SearchProvider>
    )
}
