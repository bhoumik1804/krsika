import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
// '
import { DataTableColumnHeader } from '@/components/data-table'
import { type PartyTransaction } from '../data/schema'

export const getPartyColumns = (
    t: TFunction<'millStaff', undefined>
): ColumnDef<PartyTransaction>[] => [
    {
        accessorKey: 'partyName',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.partyName')}
            />
        ),
        cell: ({ row }) => (
            <div className='w-[150px]'>{row.getValue('partyName')}</div>
        ),
        enableHiding: false,
    },
    {
        accessorKey: 'brokerName',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.brokerName')}
            />
        ),
        cell: ({ row }) => (
            <div className='w-[150px]'>{row.getValue('brokerName')}</div>
        ),
        enableHiding: false,
    },
    {
        accessorKey: 'date',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.date')}
            />
        ),
        cell: ({ row }) => (
            <div className='w-[100px]'>{row.getValue('date')}</div>
        ),
    },
    {
        accessorKey: 'purchaseDeal',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.purchaseDeal')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('purchaseDeal')}</div>,
    },
    {
        accessorKey: 'salesDeal',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.salesDeal')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('salesDeal')}</div>,
    },
    {
        accessorKey: 'inward',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.inward')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('inward')}</div>,
    },
    {
        accessorKey: 'outward',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.outward')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('outward')}</div>,
    },
    {
        accessorKey: 'accountReceipt',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.accountReceipt')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('accountReceipt')}</div>,
    },
    {
        accessorKey: 'accountPayment',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.accountPayment')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('accountPayment')}</div>,
    },
    {
        accessorKey: 'accountBrokerage',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.accountBrokerage')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('accountBrokerage')}</div>,
    },
    {
        accessorKey: 'receipt',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.receipt')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('receipt')}</div>,
    },
    {
        accessorKey: 'payment',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.payment')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('payment')}</div>,
    },
    {
        accessorKey: 'brokerage',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.brokerage')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('brokerage')}</div>,
    },
]
