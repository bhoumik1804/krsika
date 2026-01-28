import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { type StockRice } from '../data/schema'

export const stockRiceColumns: ColumnDef<StockRice>[] = [
    {
        accessorKey: 'mota',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Rice (Mota)' />
        ),
        cell: ({ row }) => <div className=''>{row.getValue('mota')}</div>,
    },
    {
        accessorKey: 'patla',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Rice (Patla)' />
        ),
        cell: ({ row }) => <div className=''>{row.getValue('patla')}</div>,
    },
]
