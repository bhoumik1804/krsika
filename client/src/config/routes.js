import Home from '@/pages/Home';
import UIGuide from '@/pages/UIGuide';
import StudentEnrollments from '@/pages/StudentEnrollments';
import Entry from '@/pages/Entry';
import Reports from '@/pages/Reports';
import {
    HomeIcon,
    UsersIcon,
    PaintBrushIcon,
    Cog6ToothIcon,
    UserIcon,
    DocumentTextIcon,
    ShoppingBagIcon,
    ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

/**
 * Centralized route configuration
 * Automatically syncs across App.jsx, AppSidebar.jsx, and AppLayout.jsx
 */
export const routes = [
    {
        path: '/',
        component: Entry,
        title: 'Entry',
        titleKey: 'entry:nav.entry',
        icon: DocumentTextIcon,
        showInSidebar: true,
        group: 'platform',
    },
    {
        path: '/reports',
        component: Reports,
        title: 'Reports',
        titleKey: 'entry:nav.reports',
        icon: DocumentTextIcon,
        showInSidebar: true,
        group: 'platform',
        children: [
            {
                path: '/reports/entry',
                component: Reports,
                title: 'Entry Reports',
                titleKey: 'reports:reports.menu.entry',
                showInSidebar: true,
            },
            {
                path: '/reports/purchase',
                component: Reports,
                title: 'Purchase Deal Reports',
                titleKey: 'reports:reports.menu.purchase',
                showInSidebar: true,
            },
            {
                path: '/reports/sales',
                component: Reports,
                title: 'Sales Deal Reports',
                titleKey: 'reports:reports.menu.sales',
                showInSidebar: true,
            },
            {
                path: '/reports/inward',
                component: Reports,
                title: 'Inward Reports',
                titleKey: 'reports:reports.menu.inward',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/purchase',
        component: Home,
        title: 'Purchase Deals',
        titleKey: 'entry:nav.purchase',
        icon: ShoppingBagIcon,
        showInSidebar: true,
        group: 'platform',
        children: [
            {
                path: '/purchase/paddy',
                component: Home,
                title: 'Paddy Purchase',
                titleKey: 'entry:entry.purchaseDeals.paddyPurchase',
                showInSidebar: true,
            },
            {
                path: '/purchase/rice',
                component: Home,
                title: 'Rice Purchase',
                titleKey: 'entry:entry.purchaseDeals.ricePurchase',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/sales',
        component: Home,
        title: 'Sales Deals',
        titleKey: 'entry:nav.sales',
        icon: ShoppingBagIcon,
        showInSidebar: true,
        group: 'platform',
        children: [
            {
                path: '/sales/paddy',
                component: Home,
                title: 'Paddy Sales',
                titleKey: 'entry:entry.purchaseDeals.paddySales',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/inward',
        component: Home,
        title: 'Inward',
        titleKey: 'entry:nav.inward',
        icon: ArrowDownTrayIcon,
        showInSidebar: true,
        group: 'platform',
        children: [
            {
                path: '/inward/govt-paddy',
                component: Home,
                title: 'Govt Paddy Inward',
                titleKey: 'entry:entry.inward.govtPaddy',
                showInSidebar: true,
            },
            {
                path: '/inward/private-paddy',
                component: Home,
                title: 'Private Paddy Inward',
                titleKey: 'entry:entry.inward.privatePaddy',
                showInSidebar: true,
            },
            {
                path: '/inward/rice',
                component: Home,
                title: 'Rice Inward',
                titleKey: 'entry:entry.inward.riceInward',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/students',
        component: StudentEnrollments,
        title: 'Student Enrollments',
        titleKey: 'students:title',
        icon: UsersIcon,
        showInSidebar: true,
        group: 'platform',
        children: [
            {
                path: '/students/new1',
                component: StudentEnrollments,
                title: 'New Student 1',
                titleKey: 'students:title',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/ui/guide',
        component: UIGuide,
        title: 'UI Guide',
        titleKey: 'common:uiGuide',
        icon: PaintBrushIcon,
        showInSidebar: true,
        group: 'platform',
    },
    {
        path: '/profile',
        component: Home,
        title: 'Profile',
        titleKey: 'common:profile',
        icon: UserIcon,
        showInSidebar: false,
    },
    {
        path: '/settings',
        component: Home,
        title: 'Settings',
        titleKey: 'common:settings',
        icon: Cog6ToothIcon,
        showInSidebar: false,
    },
];
