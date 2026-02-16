import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type PaddySalesResponse } from '../data/types'
import { DataTableRowActions } from './data-table-row-actions'

export function useBalanceLiftingSalesPaddyColumns() {
    const { t } = useTranslation('mill-staff')

    return useMemo<ColumnDef<PaddySalesResponse>[]>(
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
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.date')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='ps-3 text-nowrap'>
                        {row.getValue('date')}
                    </div>
                ),
                meta: {
                    className: cn(
                        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
                        'ps-0.5 sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
                    ),
                },
                enableHiding: false,
            },
            {
                accessorKey: 'partyName',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.partyName')}
                    />
                ),
                cell: ({ row }) => (
                    <LongText className='max-w-36'>
                        {row.getValue('partyName') || '-'}
                    </LongText>
                ),
            },
            {
                accessorKey: 'saleNumber',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'balanceLifting.paddySales.dealNumber',
                            'Deal Number'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('saleNumber') || '-'}
                    </div>
                ),
            },
            {
                accessorKey: 'paddyType',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.paddyType', 'Paddy Type')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('paddyType') || '-'}
                    </div>
                ),
            },
            {
                accessorFn: (row) => row.dhanQty || 0,
                id: 'paddyQty',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.quantity', 'Qty (Qtl)')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>{row.getValue('paddyQty')}</div>
                ),
            },
            {
                accessorFn: (row) =>
                    row.outwardData?.reduce(
                        (acc, outward) => acc + (outward.netWeight || 0),
                        0
                    ) || 0,
                id: 'lifting',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'dailyReports.balanceLifting.common.lifting',
                            'Lifting'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>{row.getValue('lifting')}</div>
                ),
            },
            {
                accessorFn: (row) => {
                    const qty = row.dhanQty || 0
                    const lifting =
                        row.outwardData?.reduce(
                            (acc, outward) => acc + (outward.netWeight || 0),
                            0
                        ) || 0
                    return qty - lifting
                },
                id: 'balance',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'dailyReports.balanceLifting.common.balance',
                            'Balance'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>{row.getValue('balance')}</div>
                ),
            },
            {
                id: 'actions',
                cell: DataTableRowActions,
            },
        ],
        [t]
    )
}
