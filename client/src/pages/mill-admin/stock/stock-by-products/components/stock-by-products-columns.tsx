import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { type StockByProducts } from '../data/schema'

export const stockByProductsColumns: ColumnDef<StockByProducts>[] = [
    {
        accessorKey: 'khanda',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Khanda (Quintal)' />
        ),
        cell: ({ row }) => <div className=''>{row.getValue('khanda')}</div>,
    },
    {
        accessorKey: 'koda',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Koda (Quintal)' />
        ),
        cell: ({ row }) => <div className=''>{row.getValue('koda')}</div>,
    },
    {
        accessorKey: 'nakkhi',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Nakkhi (Quintal)' />
        ),
        cell: ({ row }) => <div className=''>{row.getValue('nakkhi')}</div>,
    },
    {
        accessorKey: 'silkyKoda',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Silky Koda (Quintal)'
            />
        ),
        cell: ({ row }) => <div className=''>{row.getValue('silkyKoda')}</div>,
    },
    {
        accessorKey: 'bhusa',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Bhusa (Tonnes)' />
        ),
        cell: ({ row }) => <div className=''>{row.getValue('bhusa')}</div>,
    },
]
