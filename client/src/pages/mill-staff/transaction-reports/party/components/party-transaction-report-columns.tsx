import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type PartyTransaction } from '../data/schema'

/** Read-only columns for Party Transaction Report (aggregated from deals) */
export function usePartyTransactionReportColumns() {
    const { t } = useTranslation('mill-staff')

    return useMemo<ColumnDef<PartyTransaction>[]>(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                                'indeterminate')
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label='Select all'
                        className='translate-y-[2px]'
                    />
                ),
                meta: {
                    className: cn(
                        'max-md:sticky start-0 z-10 rounded-tl-[inherit]'
                    ),
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
                    <DataTableColumnHeader
                        column={column}
                        title={t('transactionReports.party')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='font-medium'>
                        {row.getValue('partyName')}
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
                accessorKey: 'brokerName',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('transactionReports.broker')}
                    />
                ),
                cell: ({ row }) => (
                    <div>{row.getValue('brokerName') || '-'}</div>
                ),
            },
            {
                accessorKey: 'date',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.date')}
                    />
                ),
                cell: ({ row }) => <div>{row.getValue('date')}</div>,
            },
            {
                accessorKey: 'purchaseDeal',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('transactionReports.purchaseDeal')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {Number(
                            row.getValue('purchaseDeal') || 0
                        ).toLocaleString()}
                    </div>
                ),
            },
            {
                accessorKey: 'salesDeal',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('transactionReports.salesDeal')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {Number(
                            row.getValue('salesDeal') || 0
                        ).toLocaleString()}
                    </div>
                ),
            },
            {
                accessorKey: 'inward',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('transactionReports.inwardKg')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {Number(row.getValue('inward') || 0).toLocaleString()}
                    </div>
                ),
            },
            {
                accessorKey: 'outward',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('transactionReports.outwardKg')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {Number(row.getValue('outward') || 0).toLocaleString()}
                    </div>
                ),
            },
            {
                accessorKey: 'receipt',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('transactionReports.receipt')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {Number(row.getValue('receipt') || 0).toLocaleString()}
                    </div>
                ),
            },
            {
                accessorKey: 'payment',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('transactionReports.payment')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {Number(row.getValue('payment') || 0).toLocaleString()}
                    </div>
                ),
            },
            {
                accessorKey: 'brokerage',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('transactionReports.brokerage')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {Number(
                            row.getValue('brokerage') || 0
                        ).toLocaleString()}
                    </div>
                ),
            },
        ],
        [t]
    )
}
