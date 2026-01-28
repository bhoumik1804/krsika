import { Factory, Wrench, Building2, Package2 } from 'lucide-react'
import { type MillStatus } from './schema'

export const statusStyles = new Map<MillStatus, string>([
    [
        'active',
        'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
    ],
    ['inactive', 'bg-neutral-300/40 border-neutral-300'],
    [
        'maintenance',
        'bg-amber-200/40 text-amber-900 dark:text-amber-100 border-amber-300',
    ],
    [
        'closed',
        'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
    ],
])

export const types = [
    {
        label: 'Rice Mill',
        value: 'rice',
        icon: Package2,
    },
    {
        label: 'Flour Mill',
        value: 'flour',
        icon: Factory,
    },
    {
        label: 'Oil Mill',
        value: 'oil',
        icon: Building2,
    },
    {
        label: 'Combined Mill',
        value: 'combined',
        icon: Wrench,
    },
] as const
