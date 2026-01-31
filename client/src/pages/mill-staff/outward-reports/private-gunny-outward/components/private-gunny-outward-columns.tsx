import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type PrivateGunnyOutward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const PrivateGunnyOutwardColumns: ColumnDef<PrivateGunnyOutward>[] = [
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
        accessorKey: 'gunnyBuyAuto',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Gunny Purchase Number'
            />
        ),
        cell: ({ row }) => (
            <div className='font-mono text-sm'>
                {row.getValue('gunnyBuyAuto')}
            </div>
        ),
    },
    {
        accessorKey: 'partyName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Party Name' />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-40'>
                {row.getValue('partyName')}
            </LongText>
        ),
    },
    {
        accessorKey: 'newGunnyQty',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='New Gunny Qty' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {(row.getValue('newGunnyQty') as number)?.toFixed(2)}
            </div>
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
