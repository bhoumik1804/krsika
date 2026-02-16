import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type OtherSales } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getOtherSalesColumns = (
    t: TFunction<'millStaff'>
): ColumnDef<OtherSales>[] => [
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
                title={t('otherSales.table.date')}
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
                title={t('otherSales.table.partyName')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>
                {row.getValue('partyName') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'brokerName',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('otherSales.table.brokerName')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>
                {row.getValue('brokerName') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'otherSaleName',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('otherSales.table.itemName')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>
                {row.getValue('otherSaleName') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'otherSaleQty',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('otherSales.table.quantity')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.original.otherSaleQty?.toFixed(2) || 0}
            </div>
        ),
    },
    {
        accessorKey: 'qtyType',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('otherSales.table.qtyType')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('qtyType') || '-'}</div>
        ),
    },
    {
        accessorKey: 'rate',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('otherSales.table.rate')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                ₹{row.original.rate?.toFixed(2) || 0}
            </div>
        ),
    },
    {
        accessorKey: 'discountPercent',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('otherSales.table.discountPercent')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.original.discountPercent?.toFixed(2) || 0}%
            </div>
        ),
    },
    {
        accessorKey: 'gst',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('otherSales.table.gst')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.original.gst?.toFixed(2) || 0}%
            </div>
        ),
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
