import { type ColumnDef } from '@tanstack/react-table'
import { formatCurrency } from '@/constants'
import { cn } from '@/lib/utils'
// import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
// import { statusStyles } from '../data/data'
import { type BalanceLiftingPurchasesPaddy } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const paddyColumns: ColumnDef<BalanceLiftingPurchasesPaddy>[] = [
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
            <div className='ps-3 text-nowrap'>{row.getValue('date')}</div>
        ),
        meta: {
            className: cn(
                'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
                'ps-1 sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
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
        cell: ({ row }) => <div>{row.getValue('brokerName') || '-'}</div>,
    },
    {
        accessorKey: 'deliveryType',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Delivery' />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('deliveryType')}</div>
        ),
    },
    {
        accessorKey: 'purchaseType',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Purchase Type' />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('purchaseType')}</div>
        ),
    },
    {
        accessorKey: 'doNumber',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='DO Number' />
        ),
        cell: ({ row }) => (
            <div className='font-mono text-sm'>
                {row.getValue('doNumber') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'committeeName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Committee' />
        ),
        cell: ({ row }) => <div>{row.getValue('committeeName') || '-'}</div>,
    },
    {
        accessorKey: 'paddyType',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Paddy Type' />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('paddyType')}</div>
        ),
    },
    {
        accessorKey: 'doPaddyQty',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='DO Qty (Qtl)' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('doPaddyQty') || '0.00'}
            </div>
        ),
    },
    {
        accessorKey: 'totalPaddyQty',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Total Qty (Qtl)' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('totalPaddyQty') || '0.00'}
            </div>
        ),
    },
    {
        accessorKey: 'paddyRatePerQuintal',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Rate/Qtl' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {formatCurrency(row.getValue('paddyRatePerQuintal') || 0)}
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
                {row.getValue('discountPercent') || '0.00'}%
            </div>
        ),
    },
    {
        accessorKey: 'brokerage',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Brokerage' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {formatCurrency(row.getValue('brokerage') || 0)}
            </div>
        ),
    },
    {
        accessorKey: 'gunnyType',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Gunny' />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('gunnyType')}</div>
        ),
    },
    {
        accessorKey: 'newGunnyRate',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='New Gunny Rate' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {formatCurrency(row.getValue('newGunnyRate') || 0)}
            </div>
        ),
    },
    {
        accessorKey: 'oldGunnyRate',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Old Gunny Rate' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {formatCurrency(row.getValue('oldGunnyRate') || 0)}
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
                {formatCurrency(row.getValue('plasticGunnyRate') || 0)}
            </div>
        ),
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
