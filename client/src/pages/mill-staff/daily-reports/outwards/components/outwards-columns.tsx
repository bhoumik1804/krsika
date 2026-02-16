import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { statusStyles } from '../data/data'
import { type OutwardEntry } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const useOutwardsColumns = (): ColumnDef<OutwardEntry>[] => {
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
                    aria-label={t('common.select')}
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
                    title={t('common.date')}
                />
            ),
            cell: ({ row }) => (
                <div className='ps-3 text-nowrap'>{row.getValue('date')}</div>
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
            accessorKey: 'gatePassNumber',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('common.gatePass')}
                />
            ),
            cell: ({ row }) => (
                <div className='font-mono font-medium'>
                    {row.getValue('gatePassNumber')}
                </div>
            ),
        },
        {
            accessorKey: 'partyName',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('common.partyName')}
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
            accessorKey: 'item',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('common.item')}
                />
            ),
            cell: ({ row }) => <div>{row.getValue('item')}</div>,
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: 'vehicleNumber',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('common.vehicleNo')}
                />
            ),
            cell: ({ row }) => (
                <div className='font-mono text-sm text-nowrap'>
                    {row.getValue('vehicleNumber')}
                </div>
            ),
        },
        {
            accessorKey: 'bags',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('common.bags')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('bags')}</div>
            ),
        },
        {
            accessorKey: 'weight',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('common.weight')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {(row.getValue('weight') as number).toLocaleString()}
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('common.status')}
                />
            ),
            cell: ({ row }) => {
                const { status } = row.original
                const badgeColor = statusStyles.get(status)
                return (
                    <div className='flex space-x-2'>
                        <Badge
                            variant='outline'
                            className={cn('capitalize', badgeColor)}
                        >
                            {t(`common.${row.getValue('status')}`)}
                        </Badge>
                    </div>
                )
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
            enableHiding: false,
            enableSorting: false,
        },
        {
            id: 'actions',
            cell: DataTableRowActions,
        },
    ]
}

