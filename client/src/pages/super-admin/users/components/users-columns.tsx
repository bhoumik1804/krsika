import { type ColumnDef } from '@tanstack/react-table'
import { Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { callTypes, roles } from '../data/data'
import { type User } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const usersColumns: ColumnDef<User>[] = [
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
            <DataTableColumnHeader column={column} title='Name' />
        ),
        cell: ({ row }) => {
            const { fullName, avatar, email } = row.original
            const initials = fullName
                ? fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                : email?.slice(0, 2).toUpperCase() || 'U'
            return (
                <div className='flex items-center gap-3 ps-2'>
                    <Avatar className='h-8 w-8'>
                        <AvatarImage src={avatar || undefined} alt={fullName} />
                        <AvatarFallback className='text-xs'>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <LongText className='max-w-36'>{fullName || '-'}</LongText>
                </div>
            )
        },
        meta: {
            className: cn(
                'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
                'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
            ),
        },
        enableHiding: false,
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
        id: 'mill',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Mill' />
        ),
        cell: ({ row }) => {
            const { millId } = row.original
            return (
                <div className='w-fit'>
                    {millId ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className='inline-flex cursor-pointer items-center justify-center rounded-md p-1 transition-colors hover:bg-accent hover:text-accent-foreground'>
                                    <Building2 size={18} />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className='w-72'>
                                <div className='space-y-2'>
                                    <h4 className='text-sm font-semibold'>
                                        Mill Details
                                    </h4>
                                    <div className='space-y-1 text-sm'>
                                        <p>
                                            <span className='text-muted-foreground'>
                                                Name:
                                            </span>{' '}
                                            <span className='font-medium'>
                                                {millId.millName}
                                            </span>
                                        </p>
                                        <p>
                                            <span className='text-muted-foreground'>
                                                Status:
                                            </span>{' '}
                                            <Badge
                                                variant='outline'
                                                className='ms-2 capitalize'
                                            >
                                                {millId.status}
                                            </Badge>
                                        </p>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <span className='text-muted-foreground'>-</span>
                    )}
                </div>
            )
        },
        enableSorting: false,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
            const { status } = row.original
            const badgeColor = callTypes.get(status)
            return (
                <div className='flex space-x-2'>
                    <Badge
                        variant='outline'
                        className={cn('capitalize', badgeColor)}
                    >
                        {row.getValue('status')}
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
        accessorKey: 'role',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Role' />
        ),
        cell: ({ row }) => {
            const { role } = row.original
            const userType = roles.find(({ value }) => value === role)

            if (!userType) {
                return null
            }

            return (
                <div className='flex items-center gap-x-2'>
                    {userType.icon && (
                        <userType.icon
                            size={16}
                            className='text-muted-foreground'
                        />
                    )}
                    <span className='text-sm capitalize'>
                        {row.getValue('role')}
                    </span>
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
        id: 'actions',
        cell: DataTableRowActions,
    },
]
