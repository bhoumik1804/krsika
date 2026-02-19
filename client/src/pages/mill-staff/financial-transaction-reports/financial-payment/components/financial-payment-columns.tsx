import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type FinancialPayment } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'

export function FinancialPaymentColumns(): ColumnDef<FinancialPayment>[] {
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
            <DataTableColumnHeader column={column} title={t('financialTransactionReports.payment.form.fields.date')} />
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
        accessorKey: 'paymentType',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('financialTransactionReports.payment.form.fields.paymentType')} />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('paymentType')}</div>
        ),
    },
    {
        accessorKey: 'partyName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('financialTransactionReports.payment.form.fields.partyName')} />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-36'>
                {row.getValue('partyName') ?? '-'}
            </LongText>
        ),
        meta: { className: 'w-36' },
    },
    {
        accessorKey: 'transporterName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('financialTransactionReports.payment.form.fields.transporterName')} />
        ),
        cell: ({ row }) => <div>{row.getValue('transporterName') ?? '-'}</div>,
    },
    {
        accessorKey: 'labourGroupName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('financialTransactionReports.payment.form.fields.labourGroupName')} />
        ),
        cell: ({ row }) => <div>{row.getValue('labourGroupName') ?? '-'}</div>,
    },
    {
        accessorKey: 'staffName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('financialTransactionReports.payment.form.fields.staffName')} />
        ),
        cell: ({ row }) => <div>{row.getValue('staffName') ?? '-'}</div>,
    },
    {
        accessorKey: 'paymentAmount',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('financialTransactionReports.payment.form.fields.paymentAmount')} />
        ),
        cell: ({ row }) => (
            <div className='text-right font-medium'>
                {row.getValue('paymentAmount')
                    ? (row.getValue('paymentAmount') as number).toFixed(2)
                    : '-'}
            </div>
        ),
    },
    {
        accessorKey: 'remarks',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('financialTransactionReports.payment.form.fields.remarks')} />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-36'>
                {row.getValue('remarks') ?? '-'}
            </LongText>
        ),
        meta: { className: 'w-36' },
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
    ]
}
