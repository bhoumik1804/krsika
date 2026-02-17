import { useMemo } from 'react'
import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { type BalanceLiftingPurchasesPaddy } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export function useBalanceLiftingPurchasesPaddyColumns() {
    const { t } = useTranslation('mill-staff')

    return useMemo<ColumnDef<BalanceLiftingPurchasesPaddy>[]>(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                                'indeterminate')
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
                accessorKey: 'date',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.date')}
                    />
                ),
                cell: ({ row }) => {
                    const date = new Date(row.getValue('date'))
                    return (
                        <div className='w-[80px]'>
                            {format(date, 'dd-MM-yyyy')}
                        </div>
                    )
                },
            },
            {
                accessorKey: 'paddyPurchaseDealNumber',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('paddyPurchase.table.paddyPurchaseDealNumber')}
                    />
                ),
                cell: ({ row }) => {
                    return (
                        <div className='flex flex-col space-y-1'>
                            <span className='max-w-[500px] truncate font-medium'>
                                {row.getValue('paddyPurchaseDealNumber')}
                            </span>
                        </div>
                    )
                },
            },
            {
                accessorKey: 'partyName',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.partyName')}
                    />
                ),
                cell: ({ row }) => {
                    return (
                        <div className='flex space-x-2'>
                            <span className='max-w-[500px] truncate font-medium'>
                                {row.getValue('partyName')}
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
                        title={t(
                            'balanceLiftingPaddyPurchase.table.brokerName'
                        )}
                    />
                ),
                cell: ({ row }) => {
                    return (
                        <div className='flex space-x-2'>
                            <span className='max-w-[500px] truncate font-medium'>
                                {row.getValue('brokerName')}
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
                        title={t('paddyPurchase.table.delivery')}
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
                        title={t('paddyPurchase.table.purchaseType')}
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
                        title={t('paddyPurchase.table.doNumber')}
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
                        title={t('paddyPurchase.table.committee')}
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
                        title={t('paddyPurchase.table.paddyType')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('paddyType')}
                    </div>
                ),
            },
            {
                accessorKey: 'totalPaddyQty',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'balanceLiftingPaddyPurchase.table.totalPaddyQty'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.getValue('totalPaddyQty') || '0.00'}
                    </div>
                ),
            },
            {
                accessorKey: 'liftedQty',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('paddyPurchase.table.liftedQty')}
                    />
                ),
                cell: ({ row }) => {
                    const total = (row.original.inwardData || []).reduce(
                        (acc: number, curr: any) =>
                            acc + (Number(curr.paddyMota) || 0),
                        0
                    )
                    return (
                        <div className='flex space-x-2'>
                            <span className='max-w-[500px] truncate font-medium'>
                                {total}
                            </span>
                        </div>
                    )
                },
            },
            {
                accessorKey: 'balanceLiftited',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('paddyPurchase.table.balanceLiftited')}
                    />
                ),
                cell: ({ row }) => {
                    const totalInward = (row.original.inwardData || []).reduce(
                        (acc: number, curr: any) =>
                            acc + (Number(curr.paddyMota) || 0),
                        0
                    )
                    return (
                        <div className='flex space-x-2'>
                            <span className='max-w-[500px] truncate font-medium'>
                                {Number(row.getValue('doPaddyQty')) -
                                    totalInward}
                            </span>
                        </div>
                    )
                },
            },
            {
                id: 'actions',
                cell: ({ row }) => <DataTableRowActions row={row} />,
            },
        ],
        [t]
    )
}
