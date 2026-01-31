import { Outlet, useParams } from 'react-router'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { getMillStaffSidebarData } from '@/components/layout/data'

type MillStaffLayoutProps = {
    children?: React.ReactNode
}

export function MillStaffLayout({ children }: MillStaffLayoutProps) {
    const defaultOpen = getCookie('sidebar_state') !== 'false'
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillStaffSidebarData(millId || '')

    return (
        <SearchProvider sidebarData={sidebarData}>
            <LayoutProvider>
                <SidebarProvider defaultOpen={defaultOpen}>
                    <AppSidebar sidebarData={sidebarData} />
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
