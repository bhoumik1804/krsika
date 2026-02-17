import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type PrivatePaddyOutward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export function usePrivatePaddyOutwardColumns(): ColumnDef<PrivatePaddyOutward>[] {
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
            meta: {
                className: cn(
                    'max-md:sticky start-0 z-10 rounded-tl-[inherit]'
                ),
            },
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
                    title={t('privatePaddyOutward.table.date')}
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
            accessorKey: 'paddySaleDealNumber',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privatePaddyOutward.table.paddySaleDealNumber')}
                />
            ),
            cell: ({ row }) => <div>{row.getValue('paddySaleDealNumber')}</div>,
        },
        {
            accessorKey: 'partyName',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privatePaddyOutward.table.partyName')}
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
            accessorKey: 'brokerName',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privatePaddyOutward.table.brokerName')}
                />
            ),
            cell: ({ row }) => (
                <LongText className='max-w-36'>
                    {row.getValue('brokerName')}
                </LongText>
            ),
            meta: { className: 'w-36' },
        },
        {
            accessorKey: 'paddyType',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privatePaddyOutward.table.paddyType')}
                />
            ),
            cell: ({ row }) => (
                <LongText className='max-w-36'>
                    {row.getValue('paddyType')}
                </LongText>
            ),
        },
        {
            accessorKey: 'doQty',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privatePaddyOutward.table.doQty')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('doQty')}</div>
            ),
        },
        {
            accessorKey: 'gunnyNew',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privatePaddyOutward.table.gunnyNew')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('gunnyNew')}</div>
            ),
        },
        {
            accessorKey: 'gunnyOld',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privatePaddyOutward.table.gunnyOld')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('gunnyOld')}</div>
            ),
        },
        {
            accessorKey: 'gunnyPlastic',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privatePaddyOutward.table.gunnyPlastic')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('gunnyPlastic')}</div>
            ),
        },
        {
            accessorKey: 'juteWeight',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privatePaddyOutward.table.juteWeight')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {(row.getValue('juteWeight') as number)?.toFixed(3)}
                </div>
            ),
        },
        {
            accessorKey: 'plasticWeight',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privatePaddyOutward.table.plasticWeight')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {(row.getValue('plasticWeight') as number)?.toFixed(3)}
                </div>
            ),
        },
        {
            accessorKey: 'truckNumber',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privatePaddyOutward.table.truckNumber')}
                />
            ),
            cell: ({ row }) => (
                <div className='font-mono text-sm text-nowrap'>
                    {row.getValue('truckNumber')}
                </div>
            ),
        },
        {
            accessorKey: 'rstNumber',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privatePaddyOutward.table.rstNumber')}
                />
            ),
            cell: ({ row }) => (
                <div className='font-mono text-sm'>
                    {row.getValue('rstNumber')}
                </div>
            ),
        },
        {
            accessorKey: 'truckWeight',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privatePaddyOutward.table.truckWeight')}
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
                    title={t('privatePaddyOutward.table.gunnyWeight')}
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
                    title={t('privatePaddyOutward.table.netWeight')}
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
                    title={t('privatePaddyOutward.table.actions')}
                />
            ),
            cell: DataTableRowActions,
        },
    ]
}
