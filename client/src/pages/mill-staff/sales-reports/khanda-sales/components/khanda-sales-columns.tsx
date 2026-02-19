import { useMemo } from 'react'
import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type KhandaSalesResponse } from '../data/types'
import { DataTableRowActions } from './data-table-row-actions'

export function useKhandaSalesColumns(): ColumnDef<KhandaSalesResponse>[] {
    const { t } = useTranslation('mill-staff')

    const columns: ColumnDef<KhandaSalesResponse>[] = useMemo(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                                'indeterminate')
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
                accessorKey: 'date',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('salesReports.khanda.form.fields.date')}
                    />
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
                accessorKey: 'partyName',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('salesReports.khanda.form.fields.partyName')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('partyName') || '-'}
                    </div>
                ),
            },
            {
                accessorKey: 'brokerName',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('salesReports.khanda.form.fields.brokerName')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('brokerName') || '-'}
                    </div>
                ),
            },
            {
                accessorKey: 'khandaQty',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('salesReports.khanda.form.fields.quantity')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.original.khandaQty?.toFixed(2) || 0}
                    </div>
                ),
            },
            {
                accessorKey: 'khandaRate',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('salesReports.khanda.form.fields.rate')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        ₹{row.original.khandaRate?.toFixed(2) || 0}
                    </div>
                ),
            },
            {
                accessorKey: 'discountPercent',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'salesReports.khanda.form.fields.discountPercent'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.original.discountPercent?.toFixed(2) || 0}%
                    </div>
                ),
            },
            {
                accessorKey: 'brokeragePerQuintal',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('salesReports.khanda.form.fields.brokerage')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        ₹{row.original.brokeragePerQuintal?.toFixed(2) || 0}
                    </div>
                ),
            },
            {
                id: 'actions',
                cell: DataTableRowActions,
            },
        ],
        [t]
    )

    return columns
}
