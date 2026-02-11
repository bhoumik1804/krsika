import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import type { KhandaSalesResponse } from '../data/types'
import { DataTableRowActions } from './data-table-row-actions'

export const khandaSalesColumns: ColumnDef<KhandaSalesResponse>[] = [
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
            <div className='ps-3 text-nowrap'>{row.getValue('date')}</div>
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
        accessorKey: 'brokerName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Broker Name' />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>
                {row.getValue('brokerName') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'khandaQty',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Khanda Qty (Qtl)' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.original.khandaQty?.toFixed(2) || 0}
            </div>
        ),
    },
    {
        accessorKey: 'khandaRate',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Khanda Rate' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                ₹{row.original.khandaRate?.toFixed(2) || 0}
            </div>
        ),
    },
    {
        accessorKey: 'discountPercent',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Discount %' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.original.discountPercent?.toFixed(2) || 0}%
            </div>
        ),
    },
    {
        accessorKey: 'brokeragePerQuintal',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Brokerage/Qtl' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                ₹{row.original.brokeragePerQuintal?.toFixed(2) || 0}
            </div>
        ),
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
