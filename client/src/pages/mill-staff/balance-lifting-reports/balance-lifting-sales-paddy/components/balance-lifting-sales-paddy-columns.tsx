import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { type PaddySalesResponse } from '../data/types'
import { DataTableRowActions } from './data-table-row-actions'
import { useTranslation } from 'react-i18next'

export const paddySalesColumns: ColumnDef<PaddySalesResponse>[] = [
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
        accessorKey: 'paddySalesDealNumber',
        header: ({ column }) => {
            const { t } = useTranslation('mill-staff')
            return (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLifting.sales.paddy.form.fields.dealNumber')}
                />
            )
        },
        cell: ({ row }) => (
            <div className='w-[100px] font-medium'>
                {row.getValue('paddySalesDealNumber')}
            </div>
        ),
    },
    {
        accessorKey: 'date',
        header: ({ column }) => {
            const { t } = useTranslation('mill-staff')
            return (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLifting.sales.paddy.form.fields.date')}
                />
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue('date'))
            return <div className='w-[100px]'>{format(date, 'dd-MM-yyyy')}</div>
        },
    },
    {
        accessorKey: 'partyName',
        header: ({ column }) => {
            const { t } = useTranslation('mill-staff')
            return (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLifting.sales.paddy.form.fields.partyName')}
                />
            )
        },
        cell: ({ row }) => (
            <div className='w-[150px]'>{row.getValue('partyName')}</div>
        ),
    },
    {
        accessorKey: 'brokerName',
        header: ({ column }) => {
            const { t } = useTranslation('mill-staff')
            return (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLifting.sales.paddy.form.fields.brokerName')}
                />
            )
        },
        cell: ({ row }) => (
            <div className='w-[150px]'>{row.getValue('brokerName')}</div>
        ),
    },
    {
        accessorKey: 'dhanQty',
        header: ({ column }) => {
            const { t } = useTranslation('mill-staff')
            return (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLifting.sales.paddy.form.fields.paddyQty')}
                />
            )
        },
        cell: ({ row }) => (
            <div className='w-[100px]'>{row.getValue('dhanQty')}</div>
        ),
    },
    {
        id: 'lifting',
        header: ({ column }) => {
            const { t } = useTranslation('mill-staff')
            return (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLifting.sales.paddy.form.fields.lifting')}
                />
            )
        },
        cell: ({ row }) => {
            const outwardData = row.original.outwardData || []
            const totalLifting = outwardData.reduce(
                (sum, entry) => sum + (entry.netWeight || 0),
                0
            )
            return <div>{totalLifting.toFixed(2)}</div>
        },
    },
    {
        id: 'balance',
        header: ({ column }) => {
            const { t } = useTranslation('mill-staff')
            return (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLifting.sales.paddy.form.fields.balanceLifting')}
                />
            )
        },
        cell: ({ row }) => {
            const qty = row.original.dhanQty || 0
            const outwardData = row.original.outwardData || []
            const totalLifting = outwardData.reduce(
                (sum, entry) => sum + (entry.netWeight || 0),
                0
            )
            const balance = qty - totalLifting
            return <div>{balance.toFixed(2)}</div>
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]
