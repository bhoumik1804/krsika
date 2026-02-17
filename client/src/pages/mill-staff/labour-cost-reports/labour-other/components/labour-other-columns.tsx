import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type LabourOther } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'

export function useLabourOtherColumns(): ColumnDef<LabourOther>[] {
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
                    title={t('labourOther.table.date')}
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
            accessorKey: 'labourType',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('labourOther.table.labourType')}
                />
            ),
            cell: ({ row }) => (
                <LongText className='max-w-36'>
                    {row.getValue('labourType')}
                </LongText>
            ),
            meta: { className: 'w-36' },
        },
        {
            accessorKey: 'labourGroupName',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('labourOther.table.labourGroupName')}
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
            accessorKey: 'numberOfGunny',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('labourOther.table.numberOfGunny')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {row.getValue('numberOfGunny') ?? '-'}
                </div>
            ),
        },
        {
            accessorKey: 'labourRate',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('labourOther.table.labourRate')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {row.getValue('labourRate')
                        ? (row.getValue('labourRate') as number).toFixed(2)
                        : '-'}
                </div>
            ),
        },
        {
            accessorKey: 'workDetail',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('labourOther.table.workDetail')}
                />
            ),
            cell: ({ row }) => (
                <LongText className='max-w-36'>
                    {row.getValue('workDetail') ?? '-'}
                </LongText>
            ),
            meta: { className: 'w-36' },
        },
        {
            accessorKey: 'totalPrice',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('labourOther.table.totalPrice')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {row.getValue('totalPrice')
                        ? (row.getValue('totalPrice') as number).toFixed(2)
                        : '-'}
                </div>
            ),
        },
        {
            id: 'actions',
            cell: DataTableRowActions,
        },
    ]
}
