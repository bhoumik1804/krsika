import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { type BalanceLiftingPurchasesPaddy } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

import { TFunction } from 'i18next'

export const getPaddyColumns = (
    t: TFunction
): ColumnDef<BalanceLiftingPurchasesPaddy>[] => [
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
            accessorKey: 'date',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLiftingPaddyPurchase.table.date')}
                />
            ),
            cell: ({ row }) => {
                const date = new Date(row.getValue('date'))
                return <div className='w-[80px]'>{date.toLocaleDateString()}</div>
            },
        },
        {
            accessorKey: 'paddyPurchaseDealNumber',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLiftingPaddyPurchase.table.dealNumber')}
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
                    title={t('balanceLiftingPaddyPurchase.table.partyName')}
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
            accessorKey: 'doPaddyQty',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLiftingPaddyPurchase.table.paddyQty')}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className='flex space-x-2'>
                        <span className='max-w-[500px] truncate font-medium'>
                            {row.getValue('doPaddyQty')}
                        </span>
                    </div>
                )
            },
        },
        {
            accessorKey: 'balance',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLiftingPaddyPurchase.table.balance')}
                />
            ),
            cell: ({ row }) => {
                const total = (row.original.inwardData || []).reduce(
                    (acc: number, curr: any) => acc + (Number(curr.paddyMota) || 0),
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
            accessorKey: 'balanceLifting',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('balanceLiftingPaddyPurchase.table.balanceLifting')}
                />
            ),
            cell: ({ row }) => {
                const totalInward = (row.original.inwardData || []).reduce(
                    (acc: number, curr: any) => acc + (Number(curr.paddyMota) || 0),
                    0
                )
                return (
                    <div className='flex space-x-2'>
                        <span className='max-w-[500px] truncate font-medium'>
                            {Number(row.getValue('doPaddyQty')) - totalInward}
                        </span>
                    </div>
                )
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => <DataTableRowActions row={row} />,
        },
    ]
