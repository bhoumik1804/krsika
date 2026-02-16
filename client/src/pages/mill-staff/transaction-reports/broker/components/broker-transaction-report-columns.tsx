import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type BrokerTransaction } from '../data/schema'

/** Read-only columns for Broker Transaction Report (aggregated from deals) */
export function useBrokerTransactionReportColumns() {
    const { t } = useTranslation('mill-staff')

    return useMemo<ColumnDef<BrokerTransaction>[]>(
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
                accessorKey: 'brokerName',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('transactionReports.brokerName')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='font-medium'>
                        {row.getValue('brokerName')}
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
                accessorKey: 'partyName',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('transactionReports.party')}
                    />
                ),
                cell: ({ row }) => (
                    <div>{row.getValue('partyName') || '-'}</div>
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
