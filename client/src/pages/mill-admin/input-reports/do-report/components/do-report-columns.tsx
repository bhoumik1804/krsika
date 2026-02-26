import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns/format'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type DoReportData } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const doReportColumns: ColumnDef<DoReportData>[] = [
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
            className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
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
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Date' />
        ),
        cell: ({ row }) => (
            <div className='ps-3 text-nowrap'>
                {format(new Date(row.getValue('date')), 'yyyy-MM-dd')}
            </div>
        ),
        meta: {
            className: cn(
                'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
                'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
            ),
        },
        enableHiding: false,
    },
    {
        accessorKey: 'samitiSangrahan',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Samiti Sangrahan' />
        ),
        cell: ({ row }) => (
            <div className='ps-3 text-nowrap'>
                {row.getValue('samitiSangrahan')}
            </div>
        ),
        meta: { className: 'w-36' },
    },
    {
        accessorKey: 'doNo',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='DO No' />
        ),
        cell: ({ row }) => <div>{row.getValue('doNo')}</div>,
    },
    {
        accessorKey: 'dhanMota',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Dhan (Mota)' />
        ),
        cell: ({ row }) => {
            const value = row.getValue('dhanMota') as number | undefined
            return <div className='text-right'>{value}</div>
        },
    },
    {
        accessorKey: 'dhanPatla',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Dhan (Patla)' />
        ),
        cell: ({ row }) => {
            const value = row.getValue('dhanPatla') as number | undefined
            return <div className='text-right'>{value}</div>
        },
    },
    {
        accessorKey: 'dhanSarna',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Dhan (Sarna)' />
        ),
        cell: ({ row }) => {
            const value = row.getValue('dhanSarna') as number | undefined
            return <div className='text-right'>{value}</div>
        },
    },
    {
        accessorKey: 'total',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Total' />
        ),
        cell: ({ row }) => {
            const total = row.getValue('total') as number | undefined
            return <div className='text-right'>{total}</div>
        },
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
