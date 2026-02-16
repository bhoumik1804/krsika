import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type RicePurchaseData } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getRiceColumns = (
    t: TFunction<'mill-staff'>
): ColumnDef<RicePurchaseData>[] => [
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
            className: cn('sticky start-0 z-10 rounded-tl-[inherit]'),
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
                title={t('ricePurchase.table.date')}
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
                'ps-0.5 sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
            ),
        },
        enableHiding: false,
    },
    {
        accessorKey: 'partyName',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('ricePurchase.table.partyName')}
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
                title={t('ricePurchase.table.brokerName')}
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
                title={t('ricePurchase.table.delivery')}
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
                title={t('ricePurchase.table.lotOrOther')}
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
                title={t('ricePurchase.table.fciOrNAN')}
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
                title={t('ricePurchase.table.type')}
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
                title={t('ricePurchase.table.weight')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.original.riceQty || 0}</div>
        ),
    },
    {
        accessorKey: 'riceRate',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('ricePurchase.table.riceRatePerQtl')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>₹{row.original.riceRate || 0}</div>
        ),
    },
    {
        accessorKey: 'discountPercent',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('ricePurchase.table.discount')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.original.discountPercent || 0}%
            </div>
        ),
    },
    {
        accessorKey: 'brokeragePerQuintal',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('ricePurchase.table.brokerage')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                ₹{row.original.brokeragePerQuintal || 0}
            </div>
        ),
    },
    {
        accessorKey: 'frkType',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('ricePurchase.table.frkType')}
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
                title={t('ricePurchase.table.frkRate')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                ₹{row.original.frkRatePerQuintal || 0}
            </div>
        ),
    },
    {
        accessorKey: 'lotNumber',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('ricePurchase.table.lotNumber')}
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
                title={t('ricePurchase.table.gunnyOption')}
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
                title={t('ricePurchase.table.newGunnyRate')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>₹{row.original.newGunnyRate || 0}</div>
        ),
    },
    {
        accessorKey: 'oldGunnyRate',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('ricePurchase.table.oldGunnyRate')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>₹{row.original.oldGunnyRate || 0}</div>
        ),
    },
    {
        accessorKey: 'plasticGunnyRate',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('ricePurchase.table.plasticGunnyRate')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                ₹{row.original.plasticGunnyRate || 0}
            </div>
        ),
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
