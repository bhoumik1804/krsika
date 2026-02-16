import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'
import { TFunction } from 'i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { PaddySales } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getPaddySalesColumns = (
    t: TFunction<'millStaff', undefined>
): ColumnDef<PaddySales>[] => [
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
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'date',
        header: t('paddySales.table.date'),
        cell: ({ row }) =>
            row.getValue('date')
                ? format(new Date(row.getValue('date')), 'yyyy-MM-dd')
                : '-',
    },
    {
        accessorKey: 'partyName',
        header: t('paddySales.table.partyName'),
        cell: ({ row }) => row.getValue('partyName') || '-',
    },
    {
        accessorKey: 'brokerName',
        header: t('paddySales.table.brokerName'),
        cell: ({ row }) => row.getValue('brokerName') || '-',
    },
    {
        accessorKey: 'saleType',
        header: t('paddySales.table.saleType'),
        cell: ({ row }) => row.getValue('saleType') || '-',
    },
    {
        accessorKey: 'doNumber',
        header: t('paddySales.table.doNumber'),
        cell: ({ row }) => row.getValue('doNumber') || '-',
    },
    {
        accessorKey: 'dhanMotaQty',
        header: t('paddySales.table.dhanMotaQty'),
        cell: ({ row }) => {
            const value = row.getValue('dhanMotaQty')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'dhanPatlaQty',
        header: t('paddySales.table.dhanPatlaQty'),
        cell: ({ row }) => {
            const value = row.getValue('dhanPatlaQty')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'dhanSarnaQty',
        header: t('paddySales.table.dhanSarnaQty'),
        cell: ({ row }) => {
            const value = row.getValue('dhanSarnaQty')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'dhanType',
        header: t('paddySales.table.dhanType'),
        cell: ({ row }) => row.getValue('dhanType') || '-',
    },
    {
        accessorKey: 'dhanQty',
        header: t('paddySales.table.dhanQty'),
        cell: ({ row }) => {
            const value = row.getValue('dhanQty')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'paddyRatePerQuintal',
        header: t('paddySales.table.paddyRatePerQuintal'),
        cell: ({ row }) => {
            const value = row.getValue('paddyRatePerQuintal')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'deliveryType',
        header: t('paddySales.table.deliveryType'),
        cell: ({ row }) => row.getValue('deliveryType') || '-',
    },
    {
        accessorKey: 'discountPercent',
        header: t('paddySales.table.discountPercent'),
        cell: ({ row }) => {
            const value = row.getValue('discountPercent')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'brokerage',
        header: t('paddySales.table.brokerage'),
        cell: ({ row }) => {
            const value = row.getValue('brokerage')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'gunnyType',
        header: t('paddySales.table.gunnyType'),
        cell: ({ row }) => row.getValue('gunnyType') || '-',
    },
    {
        accessorKey: 'newGunnyRate',
        header: t('paddySales.table.newGunnyRate'),
        cell: ({ row }) => {
            const value = row.getValue('newGunnyRate')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'oldGunnyRate',
        header: t('paddySales.table.oldGunnyRate'),
        cell: ({ row }) => {
            const value = row.getValue('oldGunnyRate')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'plasticGunnyRate',
        header: t('paddySales.table.plasticGunnyRate'),
        cell: ({ row }) => {
            const value = row.getValue('plasticGunnyRate')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]
