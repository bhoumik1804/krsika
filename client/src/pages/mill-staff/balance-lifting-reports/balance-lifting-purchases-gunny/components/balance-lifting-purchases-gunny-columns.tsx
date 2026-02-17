import { useMemo } from 'react'
import { format } from 'date-fns'
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
                        title={t('gunnyPurchase.table.date')}
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
                        title={t('gunnyPurchase.table.partyName')}
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
                            'gunnyPurchase.table.deliveryType',
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
                        title={t('gunnyPurchase.table.newGunnyQty')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.original.newGunnyQty || 0}
                    </div>
                ),
            },
            {
                accessorKey: 'oldGunnyQty',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('gunnyPurchase.table.oldGunnyQty')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.original.oldGunnyQty || 0}
                    </div>
                ),
            },
            {
                accessorKey: 'plasticGunnyQty',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('gunnyPurchase.table.plasticGunnyQty')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.original.plasticGunnyQty || 0}
                    </div>
                ),
            },
            {
                accessorKey: 'total',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('gunnyPurchase.table.total')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {Number(row.original.plasticGunnyQty) +
                            Number(row.original.oldGunnyQty) +
                            Number(row.original.newGunnyQty)}
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
