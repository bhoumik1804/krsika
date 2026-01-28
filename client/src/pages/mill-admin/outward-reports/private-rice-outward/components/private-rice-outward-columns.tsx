import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type PrivateRiceOutward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const PrivateRiceOutwardColumns: ColumnDef<PrivateRiceOutward>[] = [
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
        accessorKey: 'chawalAutoNumber',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Sale Auto No.' />
        ),
        cell: ({ row }) => (
            <div className='font-mono text-sm'>
                {row.getValue('chawalAutoNumber')}
            </div>
        ),
    },
    {
        accessorKey: 'partyName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Party Name' />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-32'>
                {row.getValue('partyName')}
            </LongText>
        ),
    },
    {
        accessorKey: 'brokerName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Broker Name' />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-32'>
                {row.getValue('brokerName')}
            </LongText>
        ),
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
        cell: ({ row }) => {
            const value = row.getValue('fciNan') as string
            return (
                <Badge variant='outline' className='font-mono'>
                    {value}
                </Badge>
            )
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
        accessorKey: 'riceQty',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Rice Qty' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {(row.getValue('riceQty') as number)?.toFixed(2)}
            </div>
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
        accessorKey: 'gunnyPlastic',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Gunny (Plastic)' />
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
        accessorKey: 'trkWt',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Truck Weight' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {(row.getValue('trkWt') as number)?.toFixed(2)}
            </div>
        ),
    },
    {
        accessorKey: 'gunnyWt',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Gunny Weight' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {(row.getValue('gunnyWt') as number)?.toFixed(2)}
            </div>
        ),
    },
    {
        accessorKey: 'finalWt',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Net Weight' />
        ),
        cell: ({ row }) => (
            <div className='text-right font-medium'>
                {(row.getValue('finalWt') as number)?.toFixed(2)}
            </div>
        ),
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
