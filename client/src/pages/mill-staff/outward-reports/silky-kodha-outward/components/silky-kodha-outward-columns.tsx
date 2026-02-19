import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type SilkyKodhaOutward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const SilkyKodhaOutwardColumns = (): ColumnDef<SilkyKodhaOutward>[] => {
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
                    title={t('outward.silkyKodhaOutward.form.fields.date')}
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
            accessorKey: 'silkyKodhaSaleDealNumber',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'outward.silkyKodhaOutward.form.fields.silkyBranSaleDealNumber'
                    )}
                />
            ),
            cell: ({ row }) => (
                <div>{row.getValue('silkyKodhaSaleDealNumber')}</div>
            ),
        },
        {
            accessorKey: 'partyName',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('outward.silkyKodhaOutward.form.fields.partyName')}
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
                        'outward.silkyKodhaOutward.form.fields.brokerName'
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
            accessorKey: 'rate',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('outward.silkyKodhaOutward.form.fields.rate')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('rate')}</div>
            ),
        },
        {
            accessorKey: 'oil',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'outward.silkyKodhaOutward.form.fields.oilPercent'
                    )}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('oil')}%</div>
            ),
        },
        {
            accessorKey: 'brokerage',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('outward.silkyKodhaOutward.form.fields.brokerage')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('brokerage')}</div>
            ),
        },
        {
            accessorKey: 'gunnyPlastic',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'outward.silkyKodhaOutward.form.fields.gunnyPlastic'
                    )}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('gunnyPlastic')}</div>
            ),
        },
        {
            accessorKey: 'plasticWeight',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'outward.silkyKodhaOutward.form.fields.plasticWeight'
                    )}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {row.getValue('plasticWeight')}
                </div>
            ),
        },
        {
            accessorKey: 'truckNo',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'outward.silkyKodhaOutward.form.fields.truckNumber'
                    )}
                />
            ),
            cell: ({ row }) => (
                <div className='text-nowrap'>{row.getValue('truckNo')}</div>
            ),
        },
        {
            accessorKey: 'truckRst',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('outward.silkyKodhaOutward.form.fields.rstNumber')}
                />
            ),
            cell: ({ row }) => <div>{row.getValue('truckRst')}</div>,
        },
        {
            accessorKey: 'truckWeight',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'outward.silkyKodhaOutward.form.fields.truckWeight'
                    )}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('truckWeight')}</div>
            ),
        },
        {
            accessorKey: 'gunnyWeight',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t(
                        'outward.silkyKodhaOutward.form.fields.gunnyWeight'
                    )}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('gunnyWeight')}</div>
            ),
        },
        {
            accessorKey: 'netWeight',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('outward.silkyKodhaOutward.form.fields.netWeight')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('netWeight')}</div>
            ),
        },
        {
            id: 'actions',
            cell: DataTableRowActions,
        },
    ]
}
