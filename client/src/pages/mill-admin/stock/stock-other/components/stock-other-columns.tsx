import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { type StockOther } from '../data/schema'

export const stockOtherColumns: ColumnDef<StockOther>[] = [
    {
        accessorKey: 'frk',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='FRK' />
        ),
        cell: ({ row }) => <div className=''>{row.getValue('frk')}</div>,
    },
]
