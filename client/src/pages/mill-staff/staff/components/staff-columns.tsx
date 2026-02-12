import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { callTypes, posts } from '../data/data'
import { type Staff, type StaffStatus } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

// Helper function to get today's attendance from history
const getTodaysAttendance = (staff: Staff) => {
    if (!staff.attendanceHistory || staff.attendanceHistory.length === 0) {
        return null
    }
    const today = new Date().toISOString().split('T')[0]
    return staff.attendanceHistory.find((record) => record.date === today)
        ?.status
}

// Helper function to calculate attendance count for the month
const getMonthAttendanceCount = (staff: Staff) => {
    if (!staff.attendanceHistory || staff.attendanceHistory.length === 0) {
        return 0
    }
    let count = 0
    staff.attendanceHistory.forEach((record) => {
        if (record.status === 'P') count += 1
        else if (record.status === 'H') count += 0.5
    })
    return count
}

// Helper function to convert isActive to status string
const getStatus = (isActive: boolean): StaffStatus =>
    isActive ? 'active' : 'inactive'

export const getStaffColumns = (
    t: TFunction<'millStaff', undefined>
): ColumnDef<Staff>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label='Select all'
                className='translate-y-[2px]'
            />
        ),
        meta: {
            className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
        },
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
                className='translate-y-[2px]'
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'fullName',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('staff.table.fullName')}
            />
        ),
        cell: ({ row }) => {
            const fullName = row.getValue('fullName') as string
            return <LongText className='max-w-36'>{fullName}</LongText>
        },
        meta: { className: 'w-36' },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('staff.table.email')}
            />
        ),
        cell: ({ row }) => (
            <div className='w-fit ps-2 text-nowrap'>
                {row.getValue('email')}
            </div>
        ),
    },
    {
        accessorKey: 'phoneNumber',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('staff.table.phoneNumber')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('phoneNumber') || '-'}</div>,
        enableSorting: false,
    },
    {
        id: 'status',
        accessorFn: (row) => getStatus(row.isActive),
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('staff.table.status')}
            />
        ),
        cell: ({ row }) => {
            const status = row.getValue('status') as StaffStatus
            const badgeColor = callTypes.get(status)
            return (
                <div className='flex space-x-2'>
                    <Badge
                        variant='outline'
                        className={cn('capitalize', badgeColor)}
                    >
                        {status}
                    </Badge>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableHiding: false,
        enableSorting: false,
    },
    {
        accessorKey: 'post',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('staff.table.post')}
            />
        ),
        cell: ({ row }) => {
            const post = row.getValue('post') as string
            const staffPost = posts.find(({ value }) => value === post)

            return (
                <div className='flex items-center gap-x-2'>
                    {staffPost?.icon && (
                        <staffPost.icon
                            size={16}
                            className='text-muted-foreground'
                        />
                    )}
                    <span className='text-sm capitalize'>{post || '-'}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: 'todaysAttendance',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('staff.table.todaysAttendance')}
            />
        ),
        cell: ({ row }) => {
            const todaysAttendance = getTodaysAttendance(row.original)
            if (!todaysAttendance) {
                return (
                    <div className='text-center text-muted-foreground'>-</div>
                )
            }
            return (
                <div className='flex justify-center'>
                    <Badge
                        variant='outline'
                        className={cn(
                            'h-7 w-7 justify-center rounded-full font-bold',
                            todaysAttendance === 'P' &&
                                'border-green-600 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-950/30 dark:text-green-400',
                            todaysAttendance === 'H' &&
                                'border-orange-600 bg-orange-50 text-orange-700 dark:border-orange-600 dark:bg-orange-950/30 dark:text-orange-400',
                            todaysAttendance === 'A' &&
                                'border-red-600 bg-red-50 text-red-700 dark:border-red-600 dark:bg-red-950/30 dark:text-red-400'
                        )}
                    >
                        {todaysAttendance}
                    </Badge>
                </div>
            )
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: 'attendanceCount',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('staff.table.monthCount')}
            />
        ),
        cell: ({ row }) => {
            const count = getMonthAttendanceCount(row.original)
            return (
                <div className='text-center font-medium'>
                    {count.toFixed(1)}
                </div>
            )
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
