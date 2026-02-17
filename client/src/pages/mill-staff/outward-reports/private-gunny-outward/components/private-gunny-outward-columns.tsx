import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type PrivateGunnyOutward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export function usePrivateGunnyOutwardColumns(): ColumnDef<PrivateGunnyOutward>[] {
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
                    title={t('privateGunnyOutward.table.date')}
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
            accessorKey: 'gunnySaleDealNumber',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privateGunnyOutward.table.gunnySaleDealNumber')}
                />
            ),
            cell: ({ row }) => <div>{row.getValue('gunnySaleDealNumber')}</div>,
        },
        {
            accessorKey: 'partyName',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privateGunnyOutward.table.partyName')}
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
            accessorKey: 'newGunnyQty',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privateGunnyOutward.table.newGunnyQty')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('newGunnyQty')}</div>
            ),
        },
        {
            accessorKey: 'oldGunnyQty',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privateGunnyOutward.table.oldGunnyQty')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('oldGunnyQty')}</div>
            ),
        },
        {
            accessorKey: 'plasticGunnyQty',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privateGunnyOutward.table.plasticGunnyQty')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {row.getValue('plasticGunnyQty')}
                </div>
            ),
        },
        {
            accessorKey: 'truckNo',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privateGunnyOutward.table.truckNo')}
                />
            ),
            cell: ({ row }) => (
                <div className='font-mono text-sm text-nowrap'>
                    {row.getValue('truckNo')}
                </div>
            ),
        },
        {
            id: 'actions',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('privateGunnyOutward.table.actions')}
                />
            ),
            cell: DataTableRowActions,
        },
    ]
}
