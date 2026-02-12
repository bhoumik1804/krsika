import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { statusStyles } from '../data/data'
import { type PurchaseDeal } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getPurchaseDealsColumns = (
    t: TFunction<'millStaff', undefined>
): ColumnDef<PurchaseDeal>[] => [
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
            className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
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
        accessorKey: 'farmerName',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.farmerName')}
            />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-36'>
                {row.getValue('farmerName')}
            </LongText>
        ),
        meta: { className: 'w-36' },
    },
    {
        accessorKey: 'commodity',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.commodity')}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('commodity')}</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'quantity',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.qtyQtl')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('quantity')}</div>
        ),
    },
    {
        accessorKey: 'rate',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.rateQtl')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('rate')}</div>
        ),
    },
    {
        accessorKey: 'totalAmount',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.totalAmount')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right font-medium'>
                {row.getValue('totalAmount')}
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.status')}
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
                        {row.getValue('status')}
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
