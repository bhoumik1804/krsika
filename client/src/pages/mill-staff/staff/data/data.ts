import { Briefcase, ShieldCheck, Users, UserCheck } from 'lucide-react'
import { type StaffStatus } from './schema'

export const callTypes = new Map<StaffStatus, string>([
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

export const statuses = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Suspended', value: 'suspended' },
]

export const roles = [
    {
        label: 'Manager',
        value: 'manager',
        icon: Briefcase,
    },
    {
        label: 'Supervisor',
        value: 'supervisor',
        icon: UserCheck,
    },
    {
        label: 'Operator',
        value: 'operator',
        icon: Users,
    },
    {
        label: 'Accountant',
        value: 'accountant',
        icon: ShieldCheck,
    },
] as const
