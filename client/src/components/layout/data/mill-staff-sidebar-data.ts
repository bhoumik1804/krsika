import {
    LayoutDashboard,
    FileBarChart,
    UserCog,
    HelpCircle,
    Settings,
    Palette,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const getMillStaffSidebarData = (
    millId: string,
    staffId: string
): SidebarData => ({
    user: {
        name: 'Staff Member',
        email: 'staff@yourmill.com',
        avatar: '/avatars/staff.jpg',
        role: 'mill-staff',
    },
    navGroups: [
        {
            title: 'Dashboard',
            items: [
                {
                    title: 'Overview',
                    url: `/staff/${millId}/${staffId}`,
                    icon: LayoutDashboard,
                },
            ],
        },
        {
            title: 'Purchase Reports',
            items: [
                {
                    title: 'Paddy Purchase Report',
                    url: `/staff/${millId}/${staffId}/purchases/paddy/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Rice Purchase Report',
                    url: `/staff/${millId}/${staffId}/purchases/rice/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Gunny Purchase Report',
                    url: `/staff/${millId}/${staffId}/purchases/gunny/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'FRK Purchase Report',
                    url: `/staff/${millId}/${staffId}/purchases/frk/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Other Purchase Report',
                    url: `/staff/${millId}/${staffId}/purchases/other/report`,
                    icon: FileBarChart,
                },
            ],
        },
        {
            title: 'Sales Reports',
            items: [
                {
                    title: 'Rice Sales Report',
                    url: `/staff/${millId}/${staffId}/sales/rice/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Paddy Sales Report',
                    url: `/staff/${millId}/${staffId}/sales/paddy/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Gunny Sales Report',
                    url: `/staff/${millId}/${staffId}/sales/gunny/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Khanda Sales Report',
                    url: `/staff/${millId}/${staffId}/sales/khanda/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Nakkhi Sales Report',
                    url: `/staff/${millId}/${staffId}/sales/nakkhi/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Other Sales Report',
                    url: `/staff/${millId}/${staffId}/sales/other/report`,
                    icon: FileBarChart,
                },
            ],
        },
        {
            title: 'Input Reports',
            items: [
                {
                    title: 'Party Report',
                    url: `/staff/${millId}/${staffId}/input/reports/party`,
                    icon: FileBarChart,
                },
                {
                    title: 'Transporter Report',
                    url: `/staff/${millId}/${staffId}/input/reports/transporter`,
                    icon: FileBarChart,
                },
                {
                    title: 'Broker Report',
                    url: `/staff/${millId}/${staffId}/input/reports/broker`,
                    icon: FileBarChart,
                },
                {
                    title: 'Committee Report',
                    url: `/staff/${millId}/${staffId}/input/reports/committee`,
                    icon: FileBarChart,
                },
                {
                    title: 'DO Report',
                    url: `/staff/${millId}/${staffId}/input/reports/do`,
                    icon: FileBarChart,
                },
                {
                    title: 'Vehicle Report',
                    url: `/staff/${millId}/${staffId}/input/reports/vehicle`,
                    icon: FileBarChart,
                },
                {
                    title: 'Staff Report',
                    url: `/staff/${millId}/${staffId}/input/reports/staff`,
                    icon: FileBarChart,
                },
                {
                    title: 'Labour Group Report',
                    url: `/staff/${millId}/${staffId}/input/reports/labour-group`,
                    icon: FileBarChart,
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
                            url: `/staff/${millId}/${staffId}/profile`,
                            icon: UserCog,
                        },
                        {
                            title: 'Appearance',
                            url: `/staff/${millId}/${staffId}/settings/appearance`,
                            icon: Palette,
                        },
                    ],
                },
                {
                    title: 'Help',
                    url: `/staff/${millId}/${staffId}/help`,
                    icon: HelpCircle,
                },
            ],
        },
    ],
    profileLinks: [
        {
            title: 'My Profile',
            url: `/staff/${millId}/${staffId}/profile`,
            icon: UserCog,
        },
        {
            title: 'Appearance',
            url: `/staff/${millId}/${staffId}/settings/appearance`,
            icon: Palette,
        },
        {
            title: 'Help',
            url: `/staff/${millId}/${staffId}/help`,
            icon: HelpCircle,
        },
    ],
})
