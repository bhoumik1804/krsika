import { useMemo } from 'react'
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
                accessorKey: 'brokerName',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('transactionReports.brokerName')}
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
                        title={t(
                            'balanceLifting.ricePurchase.deliveryType',
                            'Delivery Type'
                        )}
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
                        title={t(
                            'balanceLifting.ricePurchase.lotOrOther',
                            'Lot / Other'
                        )}
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
                        title={t(
                            'balanceLifting.ricePurchase.fciOrNan',
                            'FCI / NAN'
                        )}
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
                        title={t('common.riceType', 'Rice Type')}
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
                        title={t('common.quantity', 'Qty (Qtl)')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.original.riceQty || 0}
                    </div>
                ),
            },
            {
                accessorKey: 'riceRate',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.ratePerQuintal', 'Rate/Qtl')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        ₹{row.original.riceRate || 0}
                    </div>
                ),
            },
            {
                accessorKey: 'discountPercent',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.discountPercent', 'Discount %')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.original.discountPercent || 0}%
                    </div>
                ),
            },
            {
                accessorKey: 'brokeragePerQuintal',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.brokeragePerQuintal', 'Brokerage/Qtl')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        ₹{row.original.brokeragePerQuintal || 0}
                    </div>
                ),
            },
            {
                accessorKey: 'frkType',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.frkType', 'FRK Type')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('frkType') || '-'}
                    </div>
                ),
            },
            {
                accessorKey: 'frkRatePerQuintal',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.frkRatePerQuintal', 'FRK Rate/Qtl')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        ₹{row.original.frkRatePerQuintal || 0}
                    </div>
                ),
            },
            {
                accessorKey: 'lotNumber',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.lotNumber', 'LOT No.')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('lotNumber') || '-'}
                    </div>
                ),
            },
            {
                accessorKey: 'gunnyType',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.gunnyType', 'Gunny Type')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('gunnyType') || '-'}
                    </div>
                ),
            },
            {
                accessorKey: 'newGunnyRate',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.newGunnyRate', 'New Gunny Rate')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        ₹{row.original.newGunnyRate || 0}
                    </div>
                ),
            },
            {
                accessorKey: 'oldGunnyRate',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.oldGunnyRate', 'Old Gunny Rate')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        ₹{row.original.oldGunnyRate || 0}
                    </div>
                ),
            },
            {
                accessorKey: 'plasticGunnyRate',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'common.plasticGunnyRate',
                            'Plastic Gunny Rate'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        ₹{row.original.plasticGunnyRate || 0}
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
