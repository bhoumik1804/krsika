export const statuses = [
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Dispatched', value: 'dispatched' },
    { label: 'Cancelled', value: 'cancelled' },
]

export const statusStyles = new Map([
    ['pending', 'text-yellow-700 dark:text-yellow-500'],
    ['completed', 'text-blue-700 dark:text-blue-500'],
    ['dispatched', 'text-emerald-700 dark:text-emerald-500'],
    ['cancelled', 'text-destructive'],
])
