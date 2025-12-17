import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
    UserIcon,
    BuildingOfficeIcon,
    ChevronRightIcon,
    Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { routes } from '@/config/routes';
import { generateNavItems } from '@/utils/routeUtils';

export default function AppSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation(['entry', 'common', 'reports']);

    // Auto-generate nav items from route config
    const platformNavItems = generateNavItems(routes, 'platform');

    // Determine active view based on current route
    const activeView = React.useMemo(() => {
        if (location.pathname === '/reports') return 'reports';
        return 'entry'; // Default to entry for all other routes
    }, [location.pathname]);

    // Handle toggle change - navigate to appropriate dashboard
    const handleToggleChange = (view) => {
        if (view === 'reports') {
            navigate('/reports');
        } else {
            navigate('/');
        }
    };

    const renderMenuItem = (item) => {
        const isActive = location.pathname === item.url;
        const hasChildren = item.children && item.children.length > 0;
        const isChildActive = hasChildren && item.children.some(child => location.pathname === child.url);

        // Get translated title - use titleKey if available, otherwise use title
        const displayTitle = item.titleKey ? t(item.titleKey) : item.title;

        if (hasChildren) {
            return (
                <Collapsible key={item.title} defaultOpen={isChildActive} className="group/collapsible">
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={displayTitle} isActive={isActive || isChildActive}>
                                {item.icon && <item.icon className="size-4" />}
                                <span>{displayTitle}</span>
                                <ChevronRightIcon className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {item.children.map((child) => {
                                    const isChildItemActive = location.pathname === child.url;
                                    const childDisplayTitle = child.titleKey ? t(child.titleKey) : child.title;
                                    return (
                                        <SidebarMenuSubItem key={child.title}>
                                            <SidebarMenuSubButton asChild isActive={isChildItemActive}>
                                                <Link to={child.url}>
                                                    <span>{childDisplayTitle}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    );
                                })}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            );
        }

        return (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={displayTitle}>
                    <Link to={item.url}>
                        {item.icon && <item.icon className="size-4" />}
                        <span>{displayTitle}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    };

    // Filter menu items based on active view
    const getMenuItems = () => {
        if (activeView === 'entry') {
            // Entry view shows: Purchase/Sales/Inward (not the entry dashboard itself)
            return platformNavItems.filter(item =>
                item.url === '/purchase' ||
                item.url === '/sales' ||
                item.url === '/inward' ||
                item.url === '/students' ||
                item.url === '/ui/guide'
            );
        } else {
            // Reports view shows: Reports submenu items (Entry/Purchase/Sales/Inward reports)
            return platformNavItems.filter(item => item.url === '/reports');
        }
    };

    return (
        <Sidebar>
            {/* Sidebar Header - Company Branding */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <BuildingOfficeIcon className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Krishak</span>
                                    <span className="text-xs text-muted-foreground">Enterprise</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Entry/Reports Toggle - Enhanced UI */}
                    <SidebarMenuItem>
                        <div className="flex gap-1 p-2 bg-muted/50 rounded-lg">
                            <button
                                onClick={() => handleToggleChange('entry')}
                                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeView === 'entry'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                    }`}
                            >
                                {t('entry:dashboard.entry')}
                            </button>
                            <button
                                onClick={() => handleToggleChange('reports')}
                                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeView === 'reports'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                    }`}
                            >
                                {t('entry:dashboard.reports')}
                            </button>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Sidebar Content - Navigation */}
            <SidebarContent>
                <SidebarMenu>
                    {getMenuItems().map(renderMenuItem)}
                </SidebarMenu>
            </SidebarContent>

            {/* Sidebar Footer - User Profile with Settings */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/profile" className="flex items-center gap-2">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                                    <UserIcon className="size-4" />
                                </div>
                                <div className="flex flex-1 flex-col gap-0.5 leading-none text-left">
                                    <span className="font-semibold text-sm">User Name</span>
                                    <span className="text-xs text-muted-foreground">user@example.com</span>
                                </div>
                                <Link to="/settings" onClick={(e) => e.stopPropagation()} className="ml-auto">
                                    <Cog6ToothIcon className="size-5 text-muted-foreground hover:text-foreground transition-colors" />
                                </Link>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
