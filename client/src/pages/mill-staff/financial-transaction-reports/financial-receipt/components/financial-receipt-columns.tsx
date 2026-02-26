import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type FinancialReceipt } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export function FinancialReceiptColumns(): ColumnDef<FinancialReceipt>[] {
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
                className: cn(
                    'max-md:sticky start-0 z-10 rounded-tl-[inherit]'
                ),
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
                    title={t(
                        'financialTransactionReports.receipt.form.fields.date'
                    )}
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
                    title={t(
                        'financialTransactionReports.receipt.form.fields.partyName'
                    )}
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
                    title={t(
                        'financialTransactionReports.receipt.form.fields.brokerName'
                    )}
                />
            ),
            cell: ({ row }) => (
                <LongText className='max-w-36'>
                    {row.getValue('brokerName')}
                </LongText>
            ),
            meta: { className: 'w-36' },
        },
        {
            accessorKey: 'salesDealType',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'financialTransactionReports.receipt.form.fields.salesDealType'
                    )}
                />
            ),
            cell: ({ row }) => (
                <div>{row.getValue('salesDealType') ?? '-'}</div>
            ),
        },
        {
            accessorKey: 'salesDealNumber',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'financialTransactionReports.receipt.form.fields.salesDealNumber'
                    )}
                />
            ),
            cell: ({ row }) => (
                <div className='font-mono text-sm text-nowrap'>
                    {row.getValue('salesDealNumber')}
                </div>
            ),
        },
        {
            accessorKey: 'receivedAmount',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'financialTransactionReports.receipt.form.fields.receivedAmount'
                    )}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right font-medium'>
                    {row.getValue('receivedAmount')
                        ? (row.getValue('receivedAmount') as number).toFixed(2)
                        : '-'}
                </div>
            ),
        },
        {
            accessorKey: 'remarks',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'financialTransactionReports.receipt.form.fields.remarks'
                    )}
                />
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
