import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { PaddySales } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const paddySalesColumns: ColumnDef<PaddySales>[] = [
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
        header: 'Date',
        cell: ({ row }) =>
            row.getValue('date')
                ? format(new Date(row.getValue('date')), 'yyyy-MM-dd')
                : '-',
    },
    {
        accessorKey: 'partyName',
        header: 'Party Name',
        cell: ({ row }) => row.getValue('partyName') || '-',
    },
    {
        accessorKey: 'brokerName',
        header: 'Broker Name',
        cell: ({ row }) => row.getValue('brokerName') || '-',
    },
    {
        accessorKey: 'saleType',
        header: 'Sale Type',
        cell: ({ row }) => row.getValue('saleType') || '-',
    },
    {
        accessorKey: 'doNumber',
        header: 'DO Number',
        cell: ({ row }) => row.getValue('doNumber') || '-',
    },
    {
        accessorKey: 'dhanMotaQty',
        header: 'Dhan Mota Qty',
        cell: ({ row }) => {
            const value = row.getValue('dhanMotaQty')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'dhanPatlaQty',
        header: 'Dhan Patla Qty',
        cell: ({ row }) => {
            const value = row.getValue('dhanPatlaQty')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'dhanSarnaQty',
        header: 'Dhan Sarna Qty',
        cell: ({ row }) => {
            const value = row.getValue('dhanSarnaQty')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'dhanType',
        header: 'Dhan Type',
        cell: ({ row }) => row.getValue('dhanType') || '-',
    },
    {
        accessorKey: 'dhanQty',
        header: 'Quantity',
        cell: ({ row }) => {
            const value = row.getValue('dhanQty')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'paddyRatePerQuintal',
        header: 'Rate',
        cell: ({ row }) => {
            const value = row.getValue('paddyRatePerQuintal')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'deliveryType',
        header: 'Delivery Type',
        cell: ({ row }) => row.getValue('deliveryType') || '-',
    },
    {
        accessorKey: 'discountPercent',
        header: 'Discount %',
        cell: ({ row }) => {
            const value = row.getValue('discountPercent')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'brokerage',
        header: 'Brokerage',
        cell: ({ row }) => {
            const value = row.getValue('brokerage')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'gunnyType',
        header: 'Gunny Type',
        cell: ({ row }) => row.getValue('gunnyType') || '-',
    },
    {
        accessorKey: 'newGunnyRate',
        header: 'New Gunny Rate',
        cell: ({ row }) => {
            const value = row.getValue('newGunnyRate')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'oldGunnyRate',
        header: 'Old Gunny Rate',
        cell: ({ row }) => {
            const value = row.getValue('oldGunnyRate')
            return value ? parseFloat(String(value)).toFixed(2) : '-'
        },
    },
    {
        accessorKey: 'plasticGunnyRate',
        header: 'Plastic Gunny Rate',
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
]
