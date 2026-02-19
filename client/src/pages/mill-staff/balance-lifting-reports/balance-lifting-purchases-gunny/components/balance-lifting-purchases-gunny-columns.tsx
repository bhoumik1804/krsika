import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type BalanceLiftingPurchasesGunny } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'

import { useTranslation } from 'react-i18next'

export const gunnyColumns: ColumnDef<BalanceLiftingPurchasesGunny>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
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
        header: ({ column }) => {
            const { t } = useTranslation('mill-staff')
            return (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLifting.purchase.gunny.form.fields.date')}
                />
            )
        },
        cell: ({ row }) => (
            <div className='ps-3 text-nowrap'>
                {format(new Date(row.getValue('date')), 'yyyy-MM-dd')}
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
        header: ({ column }) => {
            const { t } = useTranslation('mill-staff')
            return (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'balanceLifting.purchase.gunny.form.fields.partyName'
                    )}
                />
            )
        },
        cell: ({ row }) => (
            <div className='text-nowrap'>
                {row.getValue('partyName') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'deliveryType',
        header: ({ column }) => {
            const { t } = useTranslation('mill-staff')
            return (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'balanceLifting.purchase.gunny.form.fields.deliveryType'
                    )}
                />
            )
        },
        cell: ({ row }) => (
            <div className='text-nowrap'>
                {row.getValue('deliveryType') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'newGunnyQty',
        header: ({ column }) => {
            const { t } = useTranslation('mill-staff')
            return (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'balanceLifting.purchase.gunny.form.fields.newGunnyQty'
                    )}
                />
            )
        },
        cell: ({ row }) => (
            <div className='text-right'>{row.original.newGunnyQty || 0}</div>
        ),
    },
    {
        accessorKey: 'newGunnyRate',
        header: ({ column }) => {
            const { t } = useTranslation('mill-staff')
            return (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'balanceLifting.purchase.gunny.form.fields.newGunnyRate'
                    )}
                />
            )
        },
        cell: ({ row }) => (
            <div className='text-right'>₹{row.original.newGunnyRate || 0}</div>
        ),
    },
    {
        accessorKey: 'oldGunnyQty',
        header: ({ column }) => {
            const { t } = useTranslation('mill-staff')
            return (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'balanceLifting.purchase.gunny.form.fields.oldGunnyQty'
                    )}
                />
            )
        },
        cell: ({ row }) => (
            <div className='text-right'>{row.original.oldGunnyQty || 0}</div>
        ),
    },
    {
        accessorKey: 'oldGunnyRate',
        header: ({ column }) => {
            const { t } = useTranslation('mill-staff')
            return (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'balanceLifting.purchase.gunny.form.fields.oldGunnyRate'
                    )}
                />
            )
        },
        cell: ({ row }) => (
            <div className='text-right'>₹{row.original.oldGunnyRate || 0}</div>
        ),
    },
    {
        accessorKey: 'plasticGunnyQty',
        header: ({ column }) => {
            const { t } = useTranslation('mill-staff')
            return (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'balanceLifting.purchase.gunny.form.fields.plasticGunnyQty'
                    )}
                />
            )
        },
        cell: ({ row }) => (
            <div className='text-right'>
                {row.original.plasticGunnyQty || 0}
            </div>
        ),
    },
    {
        accessorKey: 'plasticGunnyRate',
        header: ({ column }) => {
            const { t } = useTranslation('mill-staff')
            return (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'balanceLifting.purchase.gunny.form.fields.plasticGunnyRate'
                    )}
                />
            )
        },
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
]
