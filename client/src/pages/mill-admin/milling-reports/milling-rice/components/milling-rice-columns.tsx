import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type MillingRice } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'

export const millingRiceColumns: ColumnDef<MillingRice>[] = [
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
        accessorKey: 'riceType',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Rice Type' />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-36'>{row.getValue('riceType')}</LongText>
        ),
        meta: { className: 'w-40' },
    },
    {
        accessorKey: 'hopperInGunny',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Hopper (In Gunny)' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('hopperInGunny') ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'hopperInQintal',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Hopper (In Quintal)'
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('hopperInQintal') ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'riceQuantity',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Rice Quantity (Qtl)'
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('riceQuantity') ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'ricePercentage',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Rice (%)' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('ricePercentage') ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'khandaQuantity',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Khanda Quantity (Qtl)'
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('khandaQuantity') ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'khandaPercentage',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Khanda (%)' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('khandaPercentage') ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'silkyKodhaQuantity',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Silky Kodha Quantity (Qtl)'
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('silkyKodhaQuantity') ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'silkyKodhaPercentage',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Silky Kodha (%)' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('silkyKodhaPercentage') ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'wastagePercentage',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Wastage (%)' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('wastagePercentage') ?? '-'}
            </div>
        ),
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
