import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type BalanceLiftingPurchasesFrk } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'

export const frkColumns: ColumnDef<BalanceLiftingPurchasesFrk>[] = [
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
            className: cn('sticky start-0 z-10 rounded-tl-[inherit]'),
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
                'ps-0.5 sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
            ),
        },
        enableHiding: false,
    },
    {
        accessorKey: 'partyName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Party Name' />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>
                {row.getValue('partyName') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'frkQty',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='FRK Quantity' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.original.frkQty || 0}</div>
        ),
    },
    {
        accessorKey: 'frkRate',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='FRK Rate' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>₹{row.original.frkRate || 0}</div>
        ),
    },
    {
        accessorKey: 'gst',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='GST (%)' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.original.gst || 0}%</div>
        ),
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
