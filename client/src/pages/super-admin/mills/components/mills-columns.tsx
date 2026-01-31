import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { Contact } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { statusStyles } from '../data/data'
import { type Mill } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const millsColumns: ColumnDef<Mill>[] = [
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
        accessorKey: 'id',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Mill ID' />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-36'>{row.getValue('id')}</LongText>
        ),
        meta: { className: 'w-36' },
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Mill Name' />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-36 ps-3'>
                {row.getValue('name')}
            </LongText>
        ),
        meta: {
            className: cn(
                'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
                'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
            ),
        },
        enableHiding: false,
    },
    {
        accessorKey: 'gstNumber',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='GST No.' />
        ),
        cell: ({ row }) => (
            <div className='w-fit text-nowrap'>{row.getValue('gstNumber')}</div>
        ),
    },
    {
        accessorKey: 'panNumber',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='PAN No.' />
        ),
        cell: ({ row }) => (
            <div className='w-fit text-nowrap'>{row.getValue('panNumber')}</div>
        ),
    },
    {
        id: 'contact',
        header: 'Contact',
        cell: ({ row }) => {
            const { email, phone, location } = row.original
            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-muted-foreground hover:text-primary'
                        >
                            <Contact className='h-4 w-4' />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-80'>
                        <div className='grid gap-4'>
                            <div className='space-y-2'>
                                <h4 className='leading-none font-medium'>
                                    Contact Details
                                </h4>
                                <p className='text-sm text-muted-foreground'>
                                    Contact information for {row.original.name}
                                </p>
                            </div>
                            <div className='grid gap-2'>
                                <div className='grid grid-cols-3 items-center gap-4'>
                                    <span className='text-sm font-medium'>
                                        Email:
                                    </span>
                                    <span className='col-span-2 text-sm'>
                                        {email}
                                    </span>
                                </div>
                                <div className='grid grid-cols-3 items-center gap-4'>
                                    <span className='text-sm font-medium'>
                                        Phone:
                                    </span>
                                    <span className='col-span-2 text-sm'>
                                        {phone}
                                    </span>
                                </div>
                                <div className='grid grid-cols-3 items-start gap-4'>
                                    <span className='text-sm font-medium'>
                                        Address:
                                    </span>
                                    <span className='col-span-2 text-sm'>
                                        {location || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            )
        },
    },
    {
        accessorKey: 'planName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Current Plan' />
        ),
        cell: ({ row }) => (
            <div className='w-fit text-nowrap'>
                {row.getValue('planName') || 'No Plan'}
            </div>
        ),
    },
    {
        accessorKey: 'planValidUntil',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Plan Expiry' />
        ),
        cell: ({ row }) => {
            const date = row.getValue('planValidUntil') as Date | null
            if (!date) return <div className='text-muted-foreground'>N/A</div>
            return (
                <div className='w-fit text-nowrap'>
                    {format(date, 'MMM dd, yyyy')}
                </div>
            )
        },
    },
    {
        accessorKey: 'currency',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Currency' />
        ),
        cell: ({ row }) => <div>{row.getValue('currency')}</div>,
    },
    {
        accessorKey: 'taxPercentage',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Tax %' />
        ),
        cell: ({ row }) => <div>{row.getValue('taxPercentage')}%</div>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
            const { status } = row.original
            const badgeColor = statusStyles.get(status)
            return (
                <div className='flex space-x-2'>
                    <Badge
                        variant='outline'
                        className={cn('capitalize', badgeColor)}
                    >
                        {status.replace(/_/g, ' ').toLowerCase()}
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
        id: 'actions',
        cell: DataTableRowActions,
    },
]
