import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
// '
import { cn } from '@/lib/utils'
// import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
// import { statusStyles } from '../data/data'
import { type PaddyPurchaseData } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getPaddyColumns = (
    t: TFunction<'millStaff', undefined>
): ColumnDef<PaddyPurchaseData>[] => [
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
                title={t('tableColumns.date')}
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
                'ps-1 sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
            ),
        },
        enableHiding: false,
    },
    {
        accessorKey: 'partyName',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.partyName')}
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
                title={t('tableColumns.brokerName')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('brokerName') || '-'}</div>,
    },
    {
        accessorKey: 'deliveryType',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.delivery')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('deliveryType')}</div>
        ),
    },
    {
        accessorKey: 'purchaseType',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.purchaseType')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('purchaseType')}</div>
        ),
    },
    {
        accessorKey: 'doNumber',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.doNumber')}
            />
        ),
        cell: ({ row }) => (
            <div className='font-mono text-sm'>
                {row.getValue('doNumber') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'committeeName',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.committee')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('committeeName') || '-'}</div>,
    },
    {
        accessorKey: 'paddyType',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.paddyType')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('paddyType')}</div>
        ),
    },
    {
        accessorKey: 'doPaddyQty',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.doQty')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('doPaddyQty') || '0.00'}
            </div>
        ),
    },
    {
        accessorKey: 'totalPaddyQty',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.totalQty')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('totalPaddyQty') || '0.00'}
            </div>
        ),
    },
    {
        accessorKey: 'paddyRatePerQuintal',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.rateQtl')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('paddyRatePerQuintal') || 0}
            </div>
        ),
    },
    {
        accessorKey: 'discountPercent',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.discount')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('discountPercent') || '0.00'}%
            </div>
        ),
    },
    {
        accessorKey: 'brokerage',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.brokerage')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('brokerage') || 0}</div>
        ),
    },
    {
        accessorKey: 'gunnyType',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.gunny')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('gunnyType')}</div>
        ),
    },
    {
        accessorKey: 'newGunnyRate',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.newGunnyRate')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('newGunnyRate') || 0}
            </div>
        ),
    },
    {
        accessorKey: 'oldGunnyRate',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.oldGunnyRate')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('oldGunnyRate') || 0}
            </div>
        ),
    },
    {
        accessorKey: 'plasticGunnyRate',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.plasticGunnyRate')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('plasticGunnyRate') || 0}
            </div>
        ),
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
