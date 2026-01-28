import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { type StockGunny } from '../data/schema'

// We will manually constructing the headers in the table component to achieve the grouped effect
// So the columns here will just be the data accessors flattened
export const stockGunnyColumns: ColumnDef<StockGunny>[] = [
    {
        accessorKey: 'filledNew',
        header: 'Gunny (New)',
        cell: ({ row }) => <div className=''>{row.getValue('filledNew')}</div>,
    },
    {
        accessorKey: 'filledOld',
        header: 'Gunny (Old)',
        cell: ({ row }) => <div className=''>{row.getValue('filledOld')}</div>,
    },
    {
        accessorKey: 'filledPlastic',
        header: 'Gunny (Plastic)',
        cell: ({ row }) => (
            <div className=''>{row.getValue('filledPlastic')}</div>
        ),
    },
    {
        accessorKey: 'emptyNew',
        header: 'Gunny (New)',
        cell: ({ row }) => <div className=''>{row.getValue('emptyNew')}</div>,
    },
    {
        accessorKey: 'emptyOld',
        header: 'Gunny (Old)',
        cell: ({ row }) => <div className=''>{row.getValue('emptyOld')}</div>,
    },
    {
        accessorKey: 'emptyPlastic',
        header: 'Gunny (Plastic)',
        cell: ({ row }) => (
            <div className=''>{row.getValue('emptyPlastic')}</div>
        ),
    },
]
