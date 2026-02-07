import { LayoutDashboard, HelpCircle, Settings, Palette } from 'lucide-react'
import { type SidebarData } from '../types'

export const getGuestUserSidebarData = (): SidebarData => ({
    user: {
        name: 'Guest User',
        email: 'guest@example.com',
        avatar: '/avatars/guest.jpg',
        role: 'guest-user',
    },
    navGroups: [
        {
            title: 'Main',
            items: [
                {
                    title: 'Dashboard',
                    url: '/guest',
                    icon: LayoutDashboard,
                },
            ],
        },
    ],
    profileLinks: [
        {
            title: 'Help',
            url: '/help',
            icon: HelpCircle,
        },
        {
            title: 'Settings',
            url: '/settings',
            icon: Settings,
        },
        {
            title: 'Theme',
            url: '/theme',
            icon: Palette,
        },
    ],
})
