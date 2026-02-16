import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type RiceSales } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getRiceSalesColumns = (t: TFunction): ColumnDef<RiceSales>[] => [
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
            className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
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
                title={t('riceSales.table.date')}
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
                title={t('riceSales.table.partyName')}
            />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-36'>
                {row.getValue('partyName') || '-'}
            </LongText>
        ),
    },
    {
        accessorKey: 'brokerName',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('riceSales.table.brokerName')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>
                {row.getValue('brokerName') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'deliveryType',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('riceSales.table.deliveryType')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>
                {row.getValue('deliveryType') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'lotOrOther',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('riceSales.table.lotOrOther')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>
                {row.getValue('lotOrOther') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'fciOrNAN',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('riceSales.table.fciOrNAN')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('fciOrNAN') || '-'}</div>
        ),
    },
    {
        accessorKey: 'riceType',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('riceSales.table.riceType')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('riceType') || '-'}</div>
        ),
    },
    {
        accessorKey: 'riceQty',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('riceSales.table.riceQty')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.original.riceQty?.toFixed(2) || 0}
            </div>
        ),
    },
    {
        accessorKey: 'riceRatePerQuintal',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('riceSales.table.riceRatePerQuintal')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                ₹{row.original.riceRatePerQuintal?.toFixed(2) || 0}
            </div>
        ),
    },
    {
        accessorKey: 'discountPercent',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('riceSales.table.discountPercent')}
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
                title={t('riceSales.table.brokeragePerQuintal')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                ₹{row.original.brokeragePerQuintal?.toFixed(2) || 0}
            </div>
        ),
    },
    {
        accessorKey: 'frkType',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('riceSales.table.frkType')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('frkType') || '-'}</div>
        ),
    },
    {
        accessorKey: 'frkRatePerQuintal',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('riceSales.table.frkRatePerQuintal')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                ₹{row.original.frkRatePerQuintal?.toFixed(2) || 0}
            </div>
        ),
    },
    {
        accessorKey: 'lotNumber',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('riceSales.table.lotNumber')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>
                {row.getValue('lotNumber') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'gunnyType',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('riceSales.table.gunnyType')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>
                {row.getValue('gunnyType') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'newGunnyRate',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('riceSales.table.newGunnyRate')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                ₹{row.original.newGunnyRate?.toFixed(2) || 0}
            </div>
        ),
    },
    {
        accessorKey: 'oldGunnyRate',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('riceSales.table.oldGunnyRate')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                ₹{row.original.oldGunnyRate?.toFixed(2) || 0}
            </div>
        ),
    },
    {
        accessorKey: 'plasticGunnyRate',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('riceSales.table.plasticGunnyRate')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                ₹{row.original.plasticGunnyRate?.toFixed(2) || 0}
            </div>
        ),
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
