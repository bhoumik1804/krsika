import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { type PrivateRiceOutward } from '../data/types'
import { DataTableRowActions } from './data-table-row-actions'

export function useOutwardBalanceLiftingRiceColumns(): ColumnDef<PrivateRiceOutward>[] {
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
            accessorKey: 'riceSalesDealNumber',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLifting.outward.rice.form.fields.riceSalesDealNumber')}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className='w-[100px] font-medium'>
                        {row.getValue('riceSalesDealNumber')}
                    </div>
                )
            },
        },
        {
            accessorKey: 'date',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLifting.outward.rice.form.fields.date')}
                />
            ),
            cell: ({ row }) => {
                const dateVal = row.getValue('date')
                if (!dateVal) return '-'
                const date = new Date(dateVal as string)
                return (
                    <div className='w-[80px]'>{date.toLocaleDateString()}</div>
                )
            },
        },
        {
            accessorKey: 'partyName',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLifting.outward.rice.form.fields.partyName')}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className='flex space-x-2'>
                        <span className='max-w-[500px] truncate font-medium'>
                            {row.getValue('partyName') || '-'}
                        </span>
                    </div>
                )
            },
        },
        {
            accessorKey: 'brokerName',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLifting.outward.rice.form.fields.brokerName')}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className='flex space-x-2'>
                        <span className='max-w-[500px] truncate font-medium'>
                            {row.getValue('brokerName') || '-'}
                        </span>
                    </div>
                )
            },
        },
        {
            accessorKey: 'deliveryType',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLifting.outward.rice.form.fields.deliveryType')}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className='w-[100px]'>
                        {row.getValue('deliveryType') || '-'}
                    </div>
                )
            },
        },
        {
            accessorKey: 'lotOrOther',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLifting.outward.rice.form.fields.lotOrOther')}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className='w-[80px]'>
                        {row.getValue('lotOrOther') || '-'}
                    </div>
                )
            },
        },
        {
            accessorKey: 'fciOrNAN',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLifting.outward.rice.form.fields.fciOrNAN')}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className='w-[80px]'>
                        {row.getValue('fciOrNAN') || '-'}
                    </div>
                )
            },
        },
        {
            accessorKey: 'riceType',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLifting.outward.rice.form.fields.riceType')}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className='w-[100px] font-medium'>
                        {row.getValue('riceType') || '-'}
                    </div>
                )
            },
        },
        {
            accessorKey: 'riceQty',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLifting.outward.rice.form.fields.riceQty')}
                />
            ),
            cell: ({ row }) => {
                const val = (row.getValue('riceQty') as number) || 0
                return <div>{val}</div>
            },
        },
        {
            id: 'outward',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLifting.outward.rice.form.fields.outwardLotDeposit')}
                />
            ),
            cell: ({ row }) => {
                const outwardData = row.original.outwardData || []
                const totalOutward = outwardData.reduce(
                    (sum, entry) => sum + (entry.netWeight || 0),
                    0
                )
                return <div>{totalOutward}</div>
            },
        },
        {
            id: 'balance',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLifting.outward.rice.form.fields.outwardBalance')}
                />
            ),
            cell: ({ row }) => {
                const qty = row.original.riceQty || 0
                const outwardData = row.original.outwardData || []
                const totalOutward = outwardData.reduce(
                    (sum, entry) => sum + (entry.netWeight || 0),
                    0
                )
                const balance = qty - totalOutward
                return <div>{balance}</div>
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => <DataTableRowActions row={row} />,
        },
    ]
}
