import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type BalanceLiftingPurchasesGunny } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export function useBalanceLiftingPurchasesGunnyColumns() {
    const { t } = useTranslation('mill-staff')

    return useMemo<ColumnDef<BalanceLiftingPurchasesGunny>[]>(
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
                    <div className='text-nowrap'>
                        {row.getValue('partyName') || '-'}
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
                accessorKey: 'newGunnyQty',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.bags', 'New Gunny Qty')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.original.newGunnyQty || 0}
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
                accessorKey: 'oldGunnyQty',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.bags', 'Old Gunny Qty')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.original.oldGunnyQty || 0}
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
                accessorKey: 'plasticGunnyQty',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.bags', 'Plastic Gunny Qty')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.original.plasticGunnyQty || 0}
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
