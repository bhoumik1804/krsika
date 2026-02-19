import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type StaffReportData } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export function useStaffReportColumns(): ColumnDef<StaffReportData>[] {
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
            accessorKey: 'fullName',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('inputReports.staff.form.fields.fullName')}
                />
            ),
            cell: ({ row }) => (
                <LongText className='max-w-36 ps-3'>
                    {row.getValue('fullName')}
                </LongText>
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
            accessorKey: 'post',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('inputReports.staff.form.fields.post')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-nowrap'>{row.getValue('post') || '-'}</div>
            ),
        },
        {
            accessorKey: 'salary',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('inputReports.staff.form.fields.salary')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-left'>{row.getValue('salary')}</div>
            ),
        },
        {
            accessorKey: 'phoneNumber',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('inputReports.staff.form.fields.phoneNumber')}
                />
            ),
            cell: ({ row }) => (
                <div className='font-mono text-sm'>
                    {row.getValue('phoneNumber') || '-'}
                </div>
            ),
        },
        {
            accessorKey: 'email',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('inputReports.staff.form.fields.email')}
                />
            ),
            cell: ({ row }) => (
                <LongText className='max-w-48 text-sm'>
                    {row.getValue('email') || '-'}
                </LongText>
            ),
        },
        {
            accessorKey: 'address',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('inputReports.staff.form.fields.address')}
                />
            ),
            cell: ({ row }) => (
                <LongText className='max-w-52'>
                    {row.getValue('address') || '-'}
                </LongText>
            ),
        },
        {
            id: 'actions',
            cell: DataTableRowActions,
        },
    ]
}
