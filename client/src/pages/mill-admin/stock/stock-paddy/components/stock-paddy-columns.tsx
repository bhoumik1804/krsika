import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { type StockPaddy } from '../data/schema'

export const stockPaddyColumns: ColumnDef<StockPaddy>[] = [
    {
        accessorKey: 'mota',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Paddy (Mota)' />
        ),
        cell: ({ row }) => <div className=''>{row.getValue('mota')}</div>,
    },
    {
        accessorKey: 'patla',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Paddy (Patla)' />
        ),
        cell: ({ row }) => <div className=''>{row.getValue('patla')}</div>,
    },
    {
        accessorKey: 'sarna',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Paddy (Sarna)' />
        ),
        cell: ({ row }) => <div className=''>{row.getValue('sarna')}</div>,
    },
    {
        accessorKey: 'mahamaya',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Paddy (Mahamaya)' />
        ),
        cell: ({ row }) => <div className=''>{row.getValue('mahamaya')}</div>,
    },
    {
        accessorKey: 'rbGold',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Paddy (RB GOLD)' />
        ),
        cell: ({ row }) => <div className=''>{row.getValue('rbGold')}</div>,
    },
]
