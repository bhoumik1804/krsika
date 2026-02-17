import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type GunnyInward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export function useGunnyInwardColumns(): ColumnDef<GunnyInward>[] {
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
                    title={t('gunnyInward.table.date')}
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
            accessorKey: 'gunnyPurchaseDealNumber',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('gunnyInward.table.gunnyPurchaseDealNumber')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-nowrap'>
                    {row.getValue('gunnyPurchaseDealNumber')}
                </div>
            ),
        },
        {
            accessorKey: 'partyName',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('gunnyInward.table.partyName')}
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
            accessorKey: 'delivery',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('gunnyInward.table.delivery')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-nowrap'>{row.getValue('delivery')}</div>
            ),
        },
        {
            accessorKey: 'samitiSangrahan',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('gunnyInward.table.samitiSangrahan')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-nowrap'>
                    {row.getValue('samitiSangrahan')}
                </div>
            ),
        },
        {
            accessorKey: 'gunnyNew',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('gunnyInward.table.gunnyNew')}
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
                    title={t('gunnyInward.table.gunnyOld')}
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
                    title={t('gunnyInward.table.gunnyPlastic')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('gunnyPlastic')}</div>
            ),
        },
        {
            id: 'actions',
            cell: DataTableRowActions,
        },
    ]
}
