import {
    LayoutDashboard,
    Bug,
    FileX,
    HelpCircle,
    Lock,
    Bell,
    Palette,
    ServerOff,
    Settings,
    UserCog,
    UserX,
    Users,
    Factory,
    CreditCard,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const superAdminSidebarData: SidebarData = {
    user: {
        name: 'Super Admin',
        email: 'admin@ricemillsaas.com',
        avatar: '/avatars/admin.jpg',
        role: 'super-admin',
    },

    navGroups: [
        {
            title: 'General',
            items: [
                {
                    title: 'Dashboard',
                    url: '/admin',
                    icon: LayoutDashboard,
                },
                {
                    title: 'Mills',
                    url: '/admin/mills',
                    icon: Factory,
                },
                {
                    title: 'Users',
                    url: '/admin/users',
                    icon: Users,
                },
            ],
        },
        {
            title: 'Pages',
            items: [
                {
                    title: 'Errors',
                    icon: Bug,
                    items: [
                        {
                            title: 'Unauthorized',
                            url: '/401',
                            icon: Lock,
                        },
                        {
                            title: 'Forbidden',
                            url: '/403',
                            icon: UserX,
                        },
                        {
                            title: 'Not Found',
                            url: '/404',
                            icon: FileX,
                        },
                        {
                            title: 'Internal Server Error',
                            url: '/500',
                            icon: ServerOff,
                        },
                    ],
                },
            ],
        },
        {
            title: 'Other',
            items: [
                {
                    title: 'Settings',
                    icon: Settings,
                    items: [
                        {
                            title: 'Profile',
                            url: '/admin/settings',
                            icon: UserCog,
                        },
                        {
                            title: 'Appearance',
                            url: '/admin/settings/appearance',
                            icon: Palette,
                        },
                    ],
                },
            ],
        },
    ],
    profileLinks: [
        {
            title: 'Profile',
            url: '/admin/settings',
            icon: UserCog,
        },
        {
            title: 'Appearance',
            url: '/admin/settings/appearance',
            icon: Palette,
        },
        {
            title: 'Notifications',
            url: '#',
            icon: Bell,
        },
    ],
}
