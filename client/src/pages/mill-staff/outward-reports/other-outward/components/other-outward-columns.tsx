import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type OtherOutward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const otherOutwardColumns: ColumnDef<OtherOutward>[] = [
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
        accessorKey: 'otherSaleDealNumber',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Other Sale Deal Number'
            />
        ),
        cell: ({ row }) => <div>{row.getValue('otherSaleDealNumber')}</div>,
    },
    {
        accessorKey: 'itemName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Item Name' />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-36'>{row.getValue('itemName')}</LongText>
        ),
        meta: { className: 'w-36' },
    },
    {
        accessorKey: 'quantity',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Quantity' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('quantity')}</div>
        ),
    },
    {
        accessorKey: 'quantityType',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Qty Type' />
        ),
        cell: ({ row }) => (
            <div className='text-center'>{row.getValue('quantityType')}</div>
        ),
    },
    {
        accessorKey: 'partyName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Party Name' />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-36'>
                {row.getValue('partyName')}
            </LongText>
        ),
        meta: { className: 'w-36' },
    },
    {
        accessorKey: 'brokerName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Broker Name' />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-36'>
                {row.getValue('brokerName')}
            </LongText>
        ),
        meta: { className: 'w-36' },
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
        accessorKey: 'gunnyPlastic',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Gunny (Plastic)' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('gunnyPlastic')}</div>
        ),
    },
    {
        accessorKey: 'juteGunnyWeight',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Jute Weight' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('juteGunnyWeight')}</div>
        ),
    },
    {
        accessorKey: 'plasticGunnyWeight',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Plastic Weight' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('plasticGunnyWeight')}
            </div>
        ),
    },
    {
        accessorKey: 'truckNo',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Truck No' />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('truckNo')}</div>
        ),
    },
    {
        accessorKey: 'truckRst',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='RST No' />
        ),
        cell: ({ row }) => <div>{row.getValue('truckRst')}</div>,
    },
    {
        accessorKey: 'truckWeight',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Truck Weight' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('truckWeight')}</div>
        ),
    },
    {
        accessorKey: 'gunnyWeight',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Gunny Weight' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('gunnyWeight')}</div>
        ),
    },
    {
        accessorKey: 'netWeight',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Net Weight' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('netWeight')}</div>
        ),
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
