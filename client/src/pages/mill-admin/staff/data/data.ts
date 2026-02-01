import { Briefcase, ShieldCheck, Users, UserCheck } from 'lucide-react'

export const roles = [
    {
        label: 'Mill Admin',
        value: 'mill-admin',
        icon: ShieldCheck,
    },
    {
        label: 'Mill Staff',
        value: 'mill-staff',
        icon: Users,
    },
    {
        label: 'Super Admin',
        value: 'super-admin',
        icon: Briefcase,
    },
    {
        label: 'Guest User',
        value: 'guest-user',
        icon: UserCheck,
    },
] as const
