import { useMemo } from 'react'
import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type BalanceLiftingPurchasesRice } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export function useBalanceLiftingPurchasesRiceColumns() {
    const { t } = useTranslation('mill-staff')

    return useMemo<ColumnDef<BalanceLiftingPurchasesRice>[]>(
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
                accessorKey: 'ricePurchaseDealNumber',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('ricePurchase.table.ricePurchaseDealNumber')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('ricePurchaseDealNumber') || '-'}
                    </div>
                ),
            },
            {
                accessorKey: 'partyName',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('ricePurchase.table.partyName')}
                    />
                ),
                cell: ({ row }) => (
                    <LongText className='max-w-36'>
                        {row.getValue('partyName') || '-'}
                    </LongText>
                ),
            },
            {
                accessorKey: 'brokerName',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('ricePurchase.table..brokerName')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('brokerName') || '-'}
                    </div>
                ),
            },
            {
                accessorKey: 'deliveryType',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('ricePurchase.table.deliveryType')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('deliveryType') || '-'}
                    </div>
                ),
            },
            {
                accessorKey: 'lotOrOther',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('ricePurchase.table.lotOrOther')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('lotOrOther') || '-'}
                    </div>
                ),
            },
            {
                accessorKey: 'fciOrNAN',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('ricePurchase.table.fciOrNAN')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('fciOrNAN') || '-'}
                    </div>
                ),
            },
            {
                accessorKey: 'riceType',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('ricePurchase.table.type')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('riceType') || '-'}
                    </div>
                ),
            },
            {
                accessorKey: 'riceQty',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('ricePurchase.table.weight')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.original.riceQty || 0}
                    </div>
                ),
            },
            {
                accessorKey: 'inwarded',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('ricePurchase.table.inwarded')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.original.riceQty || 0}
                    </div>
                ),
            },
            {
                accessorKey: 'inwardQty',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('ricePurchase.table.inwardQty')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.original.riceQty || 0}
                    </div>
                ),
            },
            {
                accessorKey: 'balanceInward',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('ricePurchase.table.balanceInward')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.original.riceQty || 0}
                    </div>
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
