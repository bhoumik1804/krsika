import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import AppSidebar from './AppSidebar';
import LanguageToggle from '../LanguageToggle';
import { routes } from '@/config/routes';

export default function AppLayout({ children }) {
    const location = useLocation();
    const { t } = useTranslation(['entry', 'common']);

    // Function to get translated breadcrumbs
    const getBreadcrumbs = () => {
        const breadcrumbs = [{ label: t('entry:nav.entry'), path: '/' }]; // Home/Entry

        // Find matching route
        for (const route of routes) {
            if (route.path === location.pathname && route.path !== '/') {
                const label = route.titleKey ? t(route.titleKey) : route.title;
                breadcrumbs.push({ label, path: route.path });
                break;
            }

            // Check children
            if (route.children) {
                for (const child of route.children) {
                    if (child.path === location.pathname) {
                        const parentLabel = route.titleKey ? t(route.titleKey) : route.title;
                        const childLabel = child.titleKey ? t(child.titleKey) : child.title;
                        breadcrumbs.push({ label: parentLabel, path: route.path });
                        breadcrumbs.push({ label: childLabel, path: child.path });
                        return breadcrumbs;
                    }
                }
            }
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {/* Header with breadcrumbs */}
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />

                    {/* Auto-generated Breadcrumbs */}
                    <Breadcrumb>
                        <BreadcrumbList>
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={index}>
                                    {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                                    <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                                        {index === breadcrumbs.length - 1 ? (
                                            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink href={crumb.path}>{crumb.label}</BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Language Toggle - Right side */}
                    <div className="ml-auto">
                        <LanguageToggle />
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
