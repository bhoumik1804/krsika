import { useMemo } from 'react'
import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { PaddySales } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export function usePaddySalesColumns(): ColumnDef<PaddySales>[] {
    const { t } = useTranslation('mill-staff')

    const columns: ColumnDef<PaddySales>[] = useMemo(
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
                header: t('salesReports.paddy.form.fields.date'),
                cell: ({ row }) =>
                    row.getValue('date')
                        ? format(new Date(row.getValue('date')), 'yyyy-MM-dd')
                        : '-',
            },
            {
                accessorKey: 'partyName',
                header: t('salesReports.paddy.form.fields.partyName'),
                cell: ({ row }) => row.getValue('partyName') || '-',
            },
            {
                accessorKey: 'brokerName',
                header: t('salesReports.paddy.form.fields.brokerName'),
                cell: ({ row }) => row.getValue('brokerName') || '-',
            },
            {
                accessorKey: 'saleType',
                header: t('salesReports.paddy.form.fields.type'),
                cell: ({ row }) => row.getValue('saleType') || '-',
            },
            {
                accessorKey: 'doNumber',
                header: t('salesReports.paddy.form.fields.doNumber'),
                cell: ({ row }) => row.getValue('doNumber') || '-',
            },
            {
                accessorKey: 'dhanMotaQty',
                header: t('salesReports.paddy.form.fields.paddyMota'),
                cell: ({ row }) => {
                    const value = row.getValue('dhanMotaQty')
                    return value ? parseFloat(String(value)).toFixed(2) : '-'
                },
            },
            {
                accessorKey: 'dhanPatlaQty',
                header: t('salesReports.paddy.form.fields.paddyPatla'),
                cell: ({ row }) => {
                    const value = row.getValue('dhanPatlaQty')
                    return value ? parseFloat(String(value)).toFixed(2) : '-'
                },
            },
            {
                accessorKey: 'dhanSarnaQty',
                header: t('salesReports.paddy.form.fields.paddySarna'),
                cell: ({ row }) => {
                    const value = row.getValue('dhanSarnaQty')
                    return value ? parseFloat(String(value)).toFixed(2) : '-'
                },
            },
            {
                accessorKey: 'dhanType',
                header: t('salesReports.paddy.form.fields.paddyType'),
                cell: ({ row }) => row.getValue('dhanType') || '-',
            },
            {
                accessorKey: 'dhanQty',
                header: t('salesReports.paddy.form.fields.quantity'),
                cell: ({ row }) => {
                    const value = row.getValue('dhanQty')
                    return value ? parseFloat(String(value)).toFixed(2) : '-'
                },
            },
            {
                accessorKey: 'paddyRatePerQuintal',
                header: t('salesReports.paddy.form.fields.paddyRate'),
                cell: ({ row }) => {
                    const value = row.getValue('paddyRatePerQuintal')
                    return value ? parseFloat(String(value)).toFixed(2) : '-'
                },
            },
            {
                accessorKey: 'deliveryType',
                header: t('salesReports.paddy.form.fields.delivery'),
                cell: ({ row }) => row.getValue('deliveryType') || '-',
            },
            {
                accessorKey: 'discountPercent',
                header: t('salesReports.paddy.form.fields.batav'),
                cell: ({ row }) => {
                    const value = row.getValue('discountPercent')
                    return value ? parseFloat(String(value)).toFixed(2) : '-'
                },
            },
            {
                accessorKey: 'brokerage',
                header: t('salesReports.paddy.form.fields.brokerage'),
                cell: ({ row }) => {
                    const value = row.getValue('brokerage')
                    return value ? parseFloat(String(value)).toFixed(2) : '-'
                },
            },
            {
                accessorKey: 'gunnyType',
                header: t('salesReports.paddy.form.fields.gunnyIncluded'),
                cell: ({ row }) => row.getValue('gunnyType') || '-',
            },
            {
                accessorKey: 'newGunnyRate',
                header: t('salesReports.paddy.form.fields.newGunnyRate'),
                cell: ({ row }) => {
                    const value = row.getValue('newGunnyRate')
                    return value ? parseFloat(String(value)).toFixed(2) : '-'
                },
            },
            {
                accessorKey: 'oldGunnyRate',
                header: t('salesReports.paddy.form.fields.oldGunnyRate'),
                cell: ({ row }) => {
                    const value = row.getValue('oldGunnyRate')
                    return value ? parseFloat(String(value)).toFixed(2) : '-'
                },
            },
            {
                accessorKey: 'plasticGunnyRate',
                header: t('salesReports.paddy.form.fields.plasticGunnyRate'),
                cell: ({ row }) => {
                    const value = row.getValue('plasticGunnyRate')
                    return value ? parseFloat(String(value)).toFixed(2) : '-'
                },
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => <DataTableRowActions row={row} />,
            },
        ],
        [t]
    )

    return columns
}
