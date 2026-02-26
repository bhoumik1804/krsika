import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type LabourMilling } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export function LabourMillingColumns(): ColumnDef<LabourMilling>[] {
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
            accessorKey: 'date',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('labourCostReports.milling.form.fields.date')}
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
            accessorKey: 'hopperInGunny',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'labourCostReports.milling.form.fields.hopperCutting'
                    )}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {row.getValue('hopperInGunny') ?? '-'}
                </div>
            ),
        },
        {
            accessorKey: 'hopperRate',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'labourCostReports.milling.form.fields.hopperCuttingRate'
                    )}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {row.getValue('hopperRate')
                        ? (row.getValue('hopperRate') as number).toFixed(2)
                        : '-'}
                </div>
            ),
        },
        {
            accessorKey: 'labourGroupName',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'labourCostReports.milling.form.fields.hamalRejaToliName'
                    )}
                />
            ),
            cell: ({ row }) => (
                <LongText className='max-w-36'>
                    {row.getValue('labourGroupName')}
                </LongText>
            ),
            meta: { className: 'w-36' },
        },
        {
            id: 'actions',
            cell: DataTableRowActions,
        },
    ]
}
