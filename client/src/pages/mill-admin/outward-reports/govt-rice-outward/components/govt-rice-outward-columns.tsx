import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type GovtRiceOutward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const GovtRiceOutwardColumns: ColumnDef<GovtRiceOutward>[] = [
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
        accessorKey: 'lotNo',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='LOT No.' />
        ),
        cell: ({ row }) => (
            <div className='font-mono text-sm'>{row.getValue('lotNo')}</div>
        ),
    },
    {
        accessorKey: 'fciNan',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='FCI/NAN' />
        ),
        cell: ({ row }) => (
            <div className='font-mono text-sm'>{row.getValue('fciNan')}</div>
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'riceType',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Rice Type' />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-32'>{row.getValue('riceType')}</LongText>
        ),
    },
    {
        accessorKey: 'gunnyNew',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Gunny (New)' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('gunnyNew')}</div>
        ),
    },
    {
        accessorKey: 'gunnyOld',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Gunny (Old)' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('gunnyOld')}</div>
        ),
    },
    {
        accessorKey: 'juteWeight',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Jute Weight' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {(row.getValue('juteWeight') as number).toFixed(2)}
            </div>
        ),
    },
    {
        accessorKey: 'truckNo',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Truck No.' />
        ),
        cell: ({ row }) => (
            <div className='font-mono text-sm text-nowrap'>
                {row.getValue('truckNo')}
            </div>
        ),
    },
    {
        accessorKey: 'truckRst',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='RST No.' />
        ),
        cell: ({ row }) => (
            <div className='font-mono text-sm'>{row.getValue('truckRst')}</div>
        ),
    },
    {
        accessorKey: 'truckWeight',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Truck Weight' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {(row.getValue('truckWeight') as number).toFixed(2)}
            </div>
        ),
    },
    {
        accessorKey: 'gunnyWeight',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Gunny Weight' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {(row.getValue('gunnyWeight') as number).toFixed(2)}
            </div>
        ),
    },
    {
        accessorKey: 'netWeight',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Net Weight' />
        ),
        cell: ({ row }) => (
            <div className='text-right font-medium'>
                {(row.getValue('netWeight') as number).toFixed(2)}
            </div>
        ),
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
