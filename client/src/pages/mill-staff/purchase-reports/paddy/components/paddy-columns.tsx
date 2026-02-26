import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type PaddyPurchaseData } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export function usePaddyColumns(): ColumnDef<PaddyPurchaseData>[] {
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
                    title={t('purchaseReports.paddy.form.fields.date')}
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
                    title={t('purchaseReports.paddy.form.fields.partyName')}
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
                    title={t('purchaseReports.paddy.form.fields.brokerName')}
                />
            ),
            cell: ({ row }) => <div>{row.getValue('brokerName') || '-'}</div>,
        },
        {
            accessorKey: 'deliveryType',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('purchaseReports.paddy.form.fields.deliveryType')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-nowrap'>
                    {row.getValue('deliveryType')}
                </div>
            ),
        },
        {
            accessorKey: 'purchaseType',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('purchaseReports.paddy.form.fields.purchaseType')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-nowrap'>
                    {row.getValue('purchaseType')}
                </div>
            ),
        },
        {
            accessorKey: 'doNumber',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('purchaseReports.paddy.form.fields.doNumber')}
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
                    title={t('purchaseReports.paddy.form.fields.committeeName')}
                />
            ),
            cell: ({ row }) => (
                <div>{row.getValue('committeeName') || '-'}</div>
            ),
        },
        {
            accessorKey: 'paddyType',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('purchaseReports.paddy.form.fields.paddyType')}
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
                    title={t('purchaseReports.paddy.form.fields.doPaddyQty')}
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
                    title={t('purchaseReports.paddy.form.fields.totalPaddyQty')}
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
                    title={t(
                        'purchaseReports.paddy.form.fields.paddyRatePerQuintal'
                    )}
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
                    title={t(
                        'purchaseReports.paddy.form.fields.discountPercent'
                    )}
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
                    title={t('purchaseReports.paddy.form.fields.brokerage')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {row.getValue('brokerage') || 0}
                </div>
            ),
        },
        {
            accessorKey: 'gunnyType',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('purchaseReports.paddy.form.fields.gunnyType')}
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
                    title={t('purchaseReports.paddy.form.fields.newGunnyRate')}
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
                    title={t('purchaseReports.paddy.form.fields.oldGunnyRate')}
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
                    title={t(
                        'purchaseReports.paddy.form.fields.plasticGunnyRate'
                    )}
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
}
