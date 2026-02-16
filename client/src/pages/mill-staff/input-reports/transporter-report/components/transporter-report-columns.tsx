import { type ColumnDef } from '@tanstack/react-table'
import { TFunction } from 'i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type TransporterReportData } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getTransporterReportColumns = (
    t: TFunction
): ColumnDef<TransporterReportData>[] => [
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
        accessorKey: 'transporterName',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('transporterReport.table.name')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('transporterName')}</div>,
        meta: {
            className: cn(
                'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
                'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
            ),
        },
        enableHiding: false,
    },
    {
        accessorKey: 'gstn',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('transporterReport.table.gstn')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('gstn')}</div>,
    },
    {
        accessorKey: 'phone',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('transporterReport.table.phone')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('transporterReport.table.email')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('email')}</div>,
    },
    {
        accessorKey: 'address',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('transporterReport.table.address')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('address')}</div>,
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
