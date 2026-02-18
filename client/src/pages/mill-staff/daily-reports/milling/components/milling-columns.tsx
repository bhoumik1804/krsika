import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { statusStyles } from '../data/data'
import { type MillingEntry } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'

export const millingColumns: ColumnDef<MillingEntry>[] = [
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
        accessorKey: 'date',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Date' />
        ),
        cell: ({ row }) => (
            <div className='ps-3 text-nowrap'>
                {format(new Date(row.getValue('date')), 'yyyy-MM-dd')}
            </div>
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
        accessorKey: 'shift',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Shift' />
        ),
        cell: ({ row }) => <div>{row.getValue('shift')}</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'paddyType',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Paddy Type' />
        ),
        cell: ({ row }) => <div>{row.getValue('paddyType')}</div>,
    },
    {
        accessorKey: 'paddyQuantity',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Paddy (Qtl)' />
        ),
        cell: ({ row }) => (
            <div className='text-right font-medium'>
                {row.getValue('paddyQuantity')}
            </div>
        ),
    },
    {
        accessorKey: 'riceYield',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Rice (Kg)' />
        ),
        cell: ({ row }) => (
            <div className='text-right text-emerald-600 dark:text-emerald-400'>
                {(row.getValue('riceYield') as number).toLocaleString()}
            </div>
        ),
    },
    {
        accessorKey: 'branYield',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Bran (Kg)' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {(row.getValue('branYield') as number).toLocaleString()}
            </div>
        ),
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
        id: 'actions',
        cell: DataTableRowActions,
    },
]
