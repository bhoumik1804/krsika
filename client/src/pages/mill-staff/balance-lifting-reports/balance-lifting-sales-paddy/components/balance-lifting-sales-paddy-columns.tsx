import { useMemo } from 'react'
import { format } from 'date-fns'
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
                        {format(new Date(row.getValue('date')), 'dd-MM-yyyy')}
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
                        title={t('paddySales.table.partyName')}
                    />
                ),
                cell: ({ row }) => (
                    <LongText className='max-w-36'>
                        {row.getValue('partyName') || '-'}
                    </LongText>
                ),
            },
            {
                accessorKey: 'paddySalesDealNumber',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('paddySales.table.paddySalesDealNumber')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('paddySalesDealNumber') || '-'}
                    </div>
                ),
            },
            {
                accessorKey: 'dhanType',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('paddySales.table.dhanType')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('dhanType') || '-'}
                    </div>
                ),
            },
            {
                accessorKey: 'dhanQty',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('paddySales.table.dhanQty')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>{row.getValue('dhanQty')}</div>
                ),
            },
            {
                accessorKey: 'deliveryType',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('paddySales.table.deliveryType')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.getValue('deliveryType')}
                    </div>
                ),
            },
            {
                accessorKey: 'liftedQty',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('paddySales.table.liftedQty')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {/* {Number(row.original.inwardData?.netWeight)} */}
                        {Number(row.original?.dhanQty || 0)}
                    </div>
                ),
            },
            {
                accessorKey: 'balanceLifting',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('paddySales.table.balanceLifting')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>{row.getValue('dhanQty')}</div>
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
