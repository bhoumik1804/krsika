import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type BalanceLiftingPurchasesGunny } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'

export const gunnyColumns: ColumnDef<BalanceLiftingPurchasesGunny>[] = [
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
        accessorKey: 'deliveryType',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Delivery Type' />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>
                {row.getValue('deliveryType') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'newGunnyQty',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='New Gunny Qty' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.original.newGunnyQty || 0}</div>
        ),
    },
    {
        accessorKey: 'newGunnyRate',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='New Gunny Rate' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>₹{row.original.newGunnyRate || 0}</div>
        ),
    },
    {
        accessorKey: 'oldGunnyQty',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Old Gunny Qty' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.original.oldGunnyQty || 0}</div>
        ),
    },
    {
        accessorKey: 'oldGunnyRate',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Old Gunny Rate' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>₹{row.original.oldGunnyRate || 0}</div>
        ),
    },
    {
        accessorKey: 'plasticGunnyQty',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Plastic Gunny Qty' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.original.plasticGunnyQty || 0}
            </div>
        ),
    },
    {
        accessorKey: 'plasticGunnyRate',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Plastic Gunny Rate' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                ₹{row.original.plasticGunnyRate || 0}
            </div>
        ),
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
