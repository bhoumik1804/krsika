import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
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
        header: t('tableColumns.date'),
        cell: ({ row }) =>
            row.getValue('date')
                ? format(new Date(row.getValue('date')), 'dd MMM yyyy')
                : '-',
    },
    {
        accessorKey: 'partyName',
        header: t('tableColumns.partyName'),
        cell: ({ row }) => row.getValue('partyName') || '-',
    },
    {
        accessorKey: 'brokerName',
        header: t('tableColumns.brokerName'),
        cell: ({ row }) => row.getValue('brokerName') || '-',
    },
    {
        accessorKey: 'saleType',
        header: t('tableColumns.saleType'),
        cell: ({ row }) => row.getValue('saleType') || '-',
    },
    {
        accessorKey: 'doNumber',
        header: t('tableColumns.doNumber'),
        cell: ({ row }) => row.getValue('doNumber') || '-',
    },
    {
        accessorKey: 'dhanMotaQty',
        header: t('tableColumns.dhanMotaQty'),
        cell: ({ row }) => {
            const value = row.getValue('dhanMotaQty')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'dhanPatlaQty',
        header: t('tableColumns.dhanPatlaQty'),
        cell: ({ row }) => {
            const value = row.getValue('dhanPatlaQty')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'dhanSarnaQty',
        header: t('tableColumns.dhanSarnaQty'),
        cell: ({ row }) => {
            const value = row.getValue('dhanSarnaQty')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'dhanType',
        header: t('tableColumns.dhanType'),
        cell: ({ row }) => row.getValue('dhanType') || '-',
    },
    {
        accessorKey: 'dhanQty',
        header: t('tableColumns.quantity'),
        cell: ({ row }) => {
            const value = row.getValue('dhanQty')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'paddyRatePerQuintal',
        header: t('tableColumns.rate'),
        cell: ({ row }) => {
            const value = row.getValue('paddyRatePerQuintal')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'deliveryType',
        header: t('tableColumns.deliveryType'),
        cell: ({ row }) => row.getValue('deliveryType') || '-',
    },
    {
        accessorKey: 'discountPercent',
        header: t('tableColumns.discount'),
        cell: ({ row }) => {
            const value = row.getValue('discountPercent')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'brokerage',
        header: t('tableColumns.brokerage'),
        cell: ({ row }) => {
            const value = row.getValue('brokerage')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'gunnyType',
        header: t('tableColumns.gunnyType'),
        cell: ({ row }) => row.getValue('gunnyType') || '-',
    },
    {
        accessorKey: 'newGunnyRate',
        header: t('tableColumns.newGunnyRate'),
        cell: ({ row }) => {
            const value = row.getValue('newGunnyRate')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'oldGunnyRate',
        header: t('tableColumns.oldGunnyRate'),
        cell: ({ row }) => {
            const value = row.getValue('oldGunnyRate')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'plasticGunnyRate',
        header: t('tableColumns.plasticGunnyRate'),
        cell: ({ row }) => {
            const value = row.getValue('plasticGunnyRate')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        id: 'actions',
        header: t('tableColumns.actions'),
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]
