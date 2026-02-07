import { type ColumnDef } from '@tanstack/react-table'
// '
import { DataTableColumnHeader } from '@/components/data-table'
import { type BrokerTransaction } from '../data/schema'

export const brokerTransactionColumns: ColumnDef<BrokerTransaction>[] = [
    {
        accessorKey: 'brokerName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Broker Name' />
        ),
        cell: ({ row }) => (
            <div className='w-[150px]'>{row.getValue('brokerName')}</div>
        ),
        enableHiding: false,
    },
    {
        accessorKey: 'partyName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Party Name' />
        ),
        cell: ({ row }) => (
            <div className='w-[150px]'>{row.getValue('partyName')}</div>
        ),
        enableHiding: false,
    },
    {
        accessorKey: 'date',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Date' />
        ),
        cell: ({ row }) => (
            <div className='w-[100px]'>{row.getValue('date')}</div>
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
]
