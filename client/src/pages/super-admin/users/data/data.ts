import { Shield, UserCheck, Users, User } from 'lucide-react'
import { type UserStatus, type UserRole } from './schema'

export const callTypes = new Map<UserStatus, string>([
    [
        'active',
        'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
    ],
    ['inactive', 'bg-neutral-300/40 border-neutral-300'],
    [
        'suspended',
        'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
    ],
])

export const roles = [
    {
        label: 'Super Admin',
        value: 'super-admin' as UserRole,
        icon: Shield,
    },
    {
        label: 'Mill Admin',
        value: 'mill-admin' as UserRole,
        icon: UserCheck,
    },
    {
        label: 'Mill Staff',
        value: 'mill-staff' as UserRole,
        icon: Users,
    },
    {
        label: 'Guest User',
        value: 'guest-user' as UserRole,
        icon: User,
    },
] as const
