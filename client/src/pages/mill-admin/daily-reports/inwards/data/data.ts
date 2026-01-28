export const statuses = [
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Verified', value: 'verified' },
    { label: 'Rejected', value: 'rejected' },
]

export const statusStyles = new Map([
    ['pending', 'text-yellow-700 dark:text-yellow-500'],
    ['completed', 'text-blue-700 dark:text-blue-500'],
    ['verified', 'text-emerald-700 dark:text-emerald-500'],
    ['rejected', 'text-destructive'],
])
