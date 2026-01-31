import {
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
} from 'lucide-react'
import { type MillStatus } from './schema'

export const statusStyles = new Map<MillStatus, string>([
    [
        'ACTIVE',
        'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
    ],
    [
        'PENDING_VERIFICATION',
        'bg-amber-200/40 text-amber-900 dark:text-amber-100 border-amber-300',
    ],
    [
        'SUSPENDED',
        'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
    ],
    ['REJECTED', 'bg-neutral-300/40 border-neutral-300'],
])

export const statuses = [
    {
        label: 'Active',
        value: 'ACTIVE' as const,
        icon: CheckCircle,
    },
    {
        label: 'Pending Verification',
        value: 'PENDING_VERIFICATION' as const,
        icon: Clock,
    },
    {
        label: 'Suspended',
        value: 'SUSPENDED' as const,
        icon: AlertTriangle,
    },
    {
        label: 'Rejected',
        value: 'REJECTED' as const,
        icon: XCircle,
    },
]
