import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type BrokerTransaction } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'

export const brokerTransactionColumns: ColumnDef<BrokerTransaction>[] = [
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
        accessorKey: 'partyName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Party Name' />
        ),
        cell: ({ row }) => <div>{row.getValue('partyName')}</div>,
        meta: {
            className: cn(
                'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
                'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
            ),
        },
        enableHiding: false,
    },
    {
        accessorKey: 'brokerName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Broker Name' />
        ),
        cell: ({ row }) => <div>{row.getValue('brokerName')}</div>,
        enableHiding: false,
    },
    {
        accessorKey: 'date',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Date' />
        ),
        cell: ({ row }) => (
            <div>{format(new Date(row.getValue('date')), 'yyyy-MM-dd')}</div>
        ),
    },
    {
        accessorKey: 'purchaseDeal',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Purchase Deal' />
        ),
        cell: ({ row }) => <div>{row.getValue('purchaseDeal')}</div>,
    },
    {
        accessorKey: 'salesDeal',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Sales Deal' />
        ),
        cell: ({ row }) => <div>{row.getValue('salesDeal')}</div>,
    },
    {
        accessorKey: 'inward',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Inward' />
        ),
        cell: ({ row }) => <div>{row.getValue('inward')}</div>,
    },
    {
        accessorKey: 'outward',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Outward' />
        ),
        cell: ({ row }) => <div>{row.getValue('outward')}</div>,
    },
    {
        accessorKey: 'accountReceipt',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Account (Receipt)' />
        ),
        cell: ({ row }) => <div>{row.getValue('accountReceipt')}</div>,
    },
    {
        accessorKey: 'accountPayment',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Account (Payment)' />
        ),
        cell: ({ row }) => <div>{row.getValue('accountPayment')}</div>,
    },
    {
        accessorKey: 'accountBrokerage',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Account (Brokerage)'
            />
        ),
        cell: ({ row }) => <div>{row.getValue('accountBrokerage')}</div>,
    },
    {
        accessorKey: 'receipt',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Receipt' />
        ),
        cell: ({ row }) => <div>{row.getValue('receipt')}</div>,
    },
    {
        accessorKey: 'payment',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Payment' />
        ),
        cell: ({ row }) => <div>{row.getValue('payment')}</div>,
    },
    {
        accessorKey: 'brokerage',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Brokerage' />
        ),
        cell: ({ row }) => <div>{row.getValue('brokerage')}</div>,
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
