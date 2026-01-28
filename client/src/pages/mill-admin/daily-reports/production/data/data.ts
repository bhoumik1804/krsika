export const statuses = [
    { label: 'Pending', value: 'pending' },
    { label: 'Verified', value: 'verified' },
    { label: 'Stocked', value: 'stocked' },
    { label: 'Rejected', value: 'rejected' },
]

export const statusStyles = new Map([
    ['pending', 'text-yellow-700 dark:text-yellow-500'],
    ['verified', 'text-blue-700 dark:text-blue-500'],
    ['stocked', 'text-emerald-700 dark:text-emerald-500'],
    ['rejected', 'text-destructive'],
])
