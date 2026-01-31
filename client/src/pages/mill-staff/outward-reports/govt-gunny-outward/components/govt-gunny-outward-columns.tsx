import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type GovtGunnyOutward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const GovtGunnyOutwardColumns: ColumnDef<GovtGunnyOutward>[] = [
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
        accessorKey: 'gunnyDm',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Gunny DM No.' />
        ),
        cell: ({ row }) => (
            <div className='font-mono text-sm'>{row.getValue('gunnyDm')}</div>
        ),
    },
    {
        accessorKey: 'samitiSangrahan',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Organization' />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-40'>
                {row.getValue('samitiSangrahan')}
            </LongText>
        ),
    },
    {
        accessorKey: 'oldGunnyQty',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Old Gunny Qty' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {(row.getValue('oldGunnyQty') as number)?.toFixed(2)}
            </div>
        ),
    },
    {
        accessorKey: 'plasticGunnyQty',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Plastic Gunny Qty' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {(row.getValue('plasticGunnyQty') as number)?.toFixed(2)}
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
        id: 'actions',
        cell: DataTableRowActions,
    },
]
