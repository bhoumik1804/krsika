export const statuses = [
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Halted', value: 'halted' },
]

export const statusStyles = new Map([
    ['scheduled', 'text-blue-700 dark:text-blue-500'],
    ['in-progress', 'text-yellow-700 dark:text-yellow-500'],
    ['completed', 'text-emerald-700 dark:text-emerald-500'],
    ['halted', 'text-destructive'],
])
