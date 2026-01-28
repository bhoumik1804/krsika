export const statuses = [
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
]

export const statusStyles = new Map([
    ['pending', 'text-yellow-700 dark:text-yellow-500'],
    ['completed', 'text-emerald-700 dark:text-emerald-500'],
    ['cancelled', 'text-destructive'],
])
