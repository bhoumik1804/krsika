import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type RiceInward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const riceInwardColumns: ColumnDef<RiceInward>[] = [
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
        accessorKey: 'ricePurchaseNumber',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Rice Purchase Number'
            />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>
                {row.getValue('ricePurchaseNumber')}
            </div>
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
        accessorKey: 'riceType',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Rice Type' />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('riceType')}</div>
        ),
    },
    {
        accessorKey: 'inwardType',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Inward Type' />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('inwardType')}</div>
        ),
    },
    {
        accessorKey: 'lotNumber',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='LOT No.' />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('lotNumber')}</div>
        ),
    },
    {
        accessorKey: 'balanceInward',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Balance Inward' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('balanceInward')}</div>
        ),
    },
    {
        accessorKey: 'frkOrNAN',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='FRK Status' />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('frkOrNAN')}</div>
        ),
    },
    {
        accessorKey: 'gunnyOption',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Gunny Option' />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('gunnyOption')}</div>
        ),
    },
    {
        accessorKey: 'gunnyNew',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Gunny New' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('gunnyNew')}</div>
        ),
    },
    {
        accessorKey: 'gunnyOld',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Gunny Old' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('gunnyOld')}</div>
        ),
    },
    {
        accessorKey: 'gunnyPlastic',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Gunny Plastic' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('gunnyPlastic')}</div>
        ),
    },
    {
        accessorKey: 'juteWeight',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Jute Weight' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {(row.getValue('juteWeight') as number)?.toFixed(2)}
            </div>
        ),
    },
    {
        accessorKey: 'plasticWeight',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Plastic Weight' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {(row.getValue('plasticWeight') as number)?.toFixed(2)}
            </div>
        ),
    },
    {
        accessorKey: 'gunnyWeight',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Gunny Weight (kg.)' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {(row.getValue('gunnyWeight') as number)?.toFixed(2)}
            </div>
        ),
    },
    {
        accessorKey: 'truckNumber',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Truck Number' />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('truckNumber')}</div>
        ),
    },
    {
        accessorKey: 'rstNumber',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='RST No.' />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('rstNumber')}</div>
        ),
    },
    {
        accessorKey: 'truckLoadWeight',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Truck Load Weight (Qtl.)'
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {(row.getValue('truckLoadWeight') as number)?.toFixed(2)}
            </div>
        ),
    },
    {
        accessorKey: 'riceMotaNetWeight',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Rice Mota Net Wt (Qtl)'
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {(row.getValue('riceMotaNetWeight') as number)?.toFixed(2)}
            </div>
        ),
    },
    {
        accessorKey: 'ricePatlaNetWeight',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Rice Patla Net Wt (Qtl)'
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {(row.getValue('ricePatlaNetWeight') as number)?.toFixed(2)}
            </div>
        ),
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
