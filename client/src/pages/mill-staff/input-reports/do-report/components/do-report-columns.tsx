import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns/format'
import { type TFunction } from 'i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type DoReportData } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getDoReportColumns = (
    t: TFunction<'mill-staff', undefined>
): ColumnDef<DoReportData>[] => [
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
                aria-label={t('common.select')}
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
                aria-label={t('common.select')}
                className='translate-y-[2px]'
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'date',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('doReport.table.date')}
            />
        ),
        cell: ({ row }) => (
            <div className='ps-3 text-nowrap'>
                {format(new Date(row.getValue('date')), 'yyyy-MM-dd')}
            </div>
        ),
    },
    {
        accessorKey: 'samitiSangrahan',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('doReport.table.committee')}
            />
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
            <DataTableColumnHeader
                column={column}
                title={t('doReport.table.doNumber')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('doNo')}</div>,
    },
    {
        accessorKey: 'dhanMota',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('doReport.table.paddyMota')}
            />
        ),
        cell: ({ row }) => {
            const value = row.getValue('dhanMota') as number | undefined
            return <div className='text-right'>{value}</div>
        },
    },
    {
        accessorKey: 'dhanPatla',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('doReport.table.paddyPatla')}
            />
        ),
        cell: ({ row }) => {
            const value = row.getValue('dhanPatla') as number | undefined
            return <div className='text-right'>{value}</div>
        },
    },
    {
        accessorKey: 'dhanSarna',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('doReport.table.paddySarna')}
            />
        ),
        cell: ({ row }) => {
            const value = row.getValue('dhanSarna') as number | undefined
            return <div className='text-right'>{value}</div>
        },
    },
    {
        accessorKey: 'total',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('common.weight')} />
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
