import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type TransporterReportData } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export function useTransporterReportColumns(): ColumnDef<TransporterReportData>[] {
    const { t } = useTranslation('mill-staff')

    return [
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
                className: cn(
                    'max-md:sticky start-0 z-10 rounded-tl-[inherit]'
                ),
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
                    title={t(
                        'inputReports.transporter.form.fields.transporterName'
                    )}
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
                    title={t('inputReports.transporter.form.fields.gstn')}
                />
            ),
            cell: ({ row }) => <div>{row.getValue('gstn')}</div>,
        },
        {
            accessorKey: 'phone',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('inputReports.transporter.form.fields.phone')}
                />
            ),
            cell: ({ row }) => <div>{row.getValue('phone')}</div>,
        },
        {
            accessorKey: 'email',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('inputReports.transporter.form.fields.email')}
                />
            ),
            cell: ({ row }) => <div>{row.getValue('email')}</div>,
        },
        {
            accessorKey: 'address',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('inputReports.transporter.form.fields.address')}
                />
            ),
            cell: ({ row }) => <div>{row.getValue('address')}</div>,
        },
        {
            id: 'actions',
            cell: DataTableRowActions,
        },
    ]
}
