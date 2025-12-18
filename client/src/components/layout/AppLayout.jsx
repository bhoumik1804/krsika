"use client";

import React, { useEffect, useMemo, useCallback, memo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setActiveView } from '@/store/slices/sidebarSlice';
import { PaintBrushIcon } from '@heroicons/react/24/outline';
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
import { Button } from '@/components/ui/button';
import AppSidebar from './AppSidebar';
import LanguageToggle from '../LanguageToggle';
import { routes } from '@/config/routes';
import { getBreadcrumbs } from '@/utils/routeUtils';

// Dev mode check - evaluated once at module load
const IS_DEV = import.meta.env.DEV;

// Memoized Header Actions Component
const HeaderActions = memo(function HeaderActions({ onNavigateToGuide }) {
    if (!IS_DEV) return null;

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={onNavigateToGuide}
                className="hidden md:flex"
            >
                <PaintBrushIcon className="h-4 w-4 mr-2" />
                UI Guide
            </Button>
            <LanguageToggle />
        </>
    );
});

export default function AppLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation(['entry', 'common', 'reports']);
    const dispatch = useDispatch();

    // Memoized navigation handler
    const handleNavigateToGuide = useCallback(() => {
        navigate('/ui/guide');
    }, [navigate]);

    // Sync Redux state with current route on navigation
    useEffect(() => {
        const view = location.pathname.startsWith('/reports') ? 'reports' : 'entry';
        dispatch(setActiveView(view));
    }, [location.pathname, dispatch]);

    // Memoized breadcrumbs - only recalculate when pathname changes
    const breadcrumbs = useMemo(
        () => getBreadcrumbs(location.pathname, routes, t),
        [location.pathname, t]
    );

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
                                <React.Fragment key={crumb.path || index}>
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

                    {/* Right side actions */}
                    <div className="ml-auto flex items-center gap-2">
                        <HeaderActions onNavigateToGuide={handleNavigateToGuide} />
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex flex-1 flex-col gap-4 p-4">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}

