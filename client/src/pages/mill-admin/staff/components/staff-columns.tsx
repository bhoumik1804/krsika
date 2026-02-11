import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type StaffResponse } from '../data/types'
import { DataTableRowActions } from './data-table-row-actions'

export const staffColumns: ColumnDef<StaffResponse>[] = [
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
            <DataTableColumnHeader column={column} title='Full Name' />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-36'>{row.getValue('fullName')}</LongText>
        ),
        meta: { className: 'w-36' },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Email' />
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
            <DataTableColumnHeader column={column} title='Phone' />
        ),
        cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
        enableSorting: false,
    },
    {
        accessorKey: 'role',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Role' />
        ),
        cell: ({ row }) => (
            <Badge variant='secondary' className='capitalize'>
                {(row.getValue('role') as string)?.replace('-', ' ') || '-'}
            </Badge>
        ),
        enableSorting: false,
    },
    {
        accessorKey: 'post',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Post' />
        ),
        cell: ({ row }) => (
            <div className='capitalize'>{row.getValue('post') || '-'}</div>
        ),
        enableSorting: false,
    },
    {
        accessorKey: 'salary',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Salary' />
        ),
        cell: ({ row }) => {
            const salary = row.getValue('salary') as number | undefined
            return (
                <div className='text-right'>
                    {salary ? `₹${salary.toLocaleString()}` : '-'}
                </div>
            )
        },
    },
    {
        accessorKey: 'address',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Address' />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-32'>
                {row.getValue('address') || '-'}
            </LongText>
        ),
    },
    {
        accessorKey: 'isActive',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
            const isActive = row.getValue('isActive')
            const status = isActive ? 'active' : 'inactive'
            return (
                <Badge
                    variant={isActive ? 'default' : 'outline'}
                    className='capitalize'
                >
                    {status}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableHiding: false,
        enableSorting: false,
    },
    {
        accessorKey: 'permissions',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Permissions' />
        ),
        cell: ({ row }) => {
            const permissions = row.original.permissions || []
            if (permissions.length === 0) return <div>-</div>
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className='cursor-pointer'>
                            <Badge variant='outline'>
                                {permissions.length} module
                                {permissions.length > 1 ? 's' : ''}
                            </Badge>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className='max-w-xs'>
                        <div className='space-y-1'>
                            {permissions.map((p) => (
                                <div key={p.moduleSlug} className='text-xs'>
                                    <span className='font-medium capitalize'>
                                        {p.moduleSlug}:
                                    </span>{' '}
                                    {p.actions.join(', ')}
                                </div>
                            ))}
                        </div>
                    </TooltipContent>
                </Tooltip>
            )
        },
        enableSorting: false,
    },
    {
        accessorKey: 'attendanceHistory',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Attendance' />
        ),
        cell: ({ row }) => {
            const history = row.original.attendanceHistory || []
            if (history.length === 0) return <div>-</div>
            const present = history.filter((h) => h.status === 'P').length
            const absent = history.filter((h) => h.status === 'A').length
            const halfDay = history.filter((h) => h.status === 'H').length
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className='flex cursor-pointer gap-1'>
                            <Badge
                                variant='default'
                                className='bg-green-600 text-xs'
                            >
                                P:{present}
                            </Badge>
                            <Badge variant='destructive' className='text-xs'>
                                A:{absent}
                            </Badge>
                            <Badge variant='secondary' className='text-xs'>
                                H:{halfDay}
                            </Badge>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className='max-w-xs'>
                        <div className='space-y-1'>
                            {history.slice(0, 10).map((h) => (
                                <div key={h.date} className='text-xs'>
                                    {h.date}:{' '}
                                    <span
                                        className={cn(
                                            'font-medium',
                                            h.status === 'P' &&
                                                'text-green-600',
                                            h.status === 'A' && 'text-red-600',
                                            h.status === 'H' &&
                                                'text-yellow-600'
                                        )}
                                    >
                                        {h.status === 'P'
                                            ? 'Present'
                                            : h.status === 'A'
                                              ? 'Absent'
                                              : 'Half Day'}
                                    </span>
                                </div>
                            ))}
                            {history.length > 10 && (
                                <div className='text-xs text-muted-foreground'>
                                    +{history.length - 10} more
                                </div>
                            )}
                        </div>
                    </TooltipContent>
                </Tooltip>
            )
        },
        enableSorting: false,
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Joined At' />
        ),
        cell: ({ row }) => {
            const date = row.getValue('createdAt') as string
            return (
                <div className='text-nowrap'>
                    {date ? format(new Date(date), 'MMM dd, yyyy') : '-'}
                </div>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]
