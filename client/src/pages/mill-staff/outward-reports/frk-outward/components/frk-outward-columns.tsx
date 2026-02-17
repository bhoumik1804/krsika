import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type FrkOutward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export function useFrkOutwardColumns(): ColumnDef<FrkOutward>[] {
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
                    aria-label={t('common.selectAll')}
                    className='translate-y-[2px]'
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label={t('common.selectRow')}
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
                    title={t('frkOutward.table.date')}
                />
            ),
            cell: ({ row }) => {
                const date = row.getValue('date')
                return (
                    <div className='ps-3 text-nowrap'>
                        {format(new Date(date as string), 'yyyy-MM-dd')}
                    </div>
                )
            },
            enableHiding: false,
        },
        {
            accessorKey: 'partyName',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('frkOutward.table.partyName')}
                />
            ),
            cell: ({ row }) => (
                <LongText className='max-w-36'>
                    {row.getValue('partyName')}
                </LongText>
            ),
            meta: { className: 'w-36' },
        },
        {
            accessorKey: 'gunnyPlastic',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('frkOutward.table.gunnyPlastic')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('gunnyPlastic')}</div>
            ),
        },
        {
            accessorKey: 'plasticWeight',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('frkOutward.table.plasticWeight')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {(row.getValue('plasticWeight') as number)?.toFixed(3)}
                </div>
            ),
        },
        {
            accessorKey: 'truckNo',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('frkOutward.table.truckNo')}
                />
            ),
            cell: ({ row }) => (
                <div className='font-mono text-sm text-nowrap'>
                    {row.getValue('truckNo')}
                </div>
            ),
        },
        {
            accessorKey: 'truckRst',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('frkOutward.table.rstNo')}
                />
            ),
            cell: ({ row }) => (
                <div className='font-mono text-sm'>
                    {row.getValue('truckRst')}
                </div>
            ),
        },
        {
            accessorKey: 'truckWeight',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('frkOutward.table.truckWeight')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {(row.getValue('truckWeight') as number)?.toFixed(2)}
                </div>
            ),
        },
        {
            accessorKey: 'gunnyWeight',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('frkOutward.table.gunnyWeight')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {(row.getValue('gunnyWeight') as number)?.toFixed(2)}
                </div>
            ),
        },
        {
            accessorKey: 'netWeight',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('frkOutward.table.netWeight')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {(row.getValue('netWeight') as number)?.toFixed(2)}
                </div>
            ),
        },
        {
            id: 'actions',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('frkOutward.table.actions')}
                />
            ),
            cell: DataTableRowActions,
        },
    ]
}
