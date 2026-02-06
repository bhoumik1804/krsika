import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export const statuses = [
    {
        label: 'Active',
        value: 'active' as const,
        icon: CheckCircle,
    },
    {
        label: 'Pending Verification',
        value: 'pending-verification' as const,
        icon: Clock,
    },
    {
        label: 'Suspended',
        value: 'suspended' as const,
        icon: AlertTriangle,
    },
    {
        label: 'Rejected',
        value: 'rejected' as const,
        icon: XCircle,
    },
]
