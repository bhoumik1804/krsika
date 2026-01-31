export const statuses = [
    { label: 'Pending', value: 'pending' },
    { label: 'Cleared', value: 'cleared' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Bounced', value: 'bounced' },
]

export const statusStyles = new Map([
    ['pending', 'text-yellow-700 dark:text-yellow-500'],
    ['cleared', 'text-emerald-700 dark:text-emerald-500'],
    ['cancelled', 'text-destructive'],
    ['bounced', 'text-destructive font-bold'],
])
