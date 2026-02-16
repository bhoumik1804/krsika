import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { type PrivateRiceOutward } from '../data/types'
import { DataTableRowActions } from './data-table-row-actions'

export const outwardBalanceLiftingRiceColumns: ColumnDef<PrivateRiceOutward>[] =
    [
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
                <DataTableColumnHeader column={column} title='Date' />
            ),
            cell: ({ row }) => {
                const date = new Date(row.getValue('date'))
                return (
                    <div className='w-[80px]'>{date.toLocaleDateString()}</div>
                )
            },
        },
        {
            accessorKey: 'partyName',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title='Party Name' />
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
                <DataTableColumnHeader column={column} title='Broker Name' />
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
            accessorKey: 'riceQty',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title='Rice Qty' />
            ),
            cell: ({ row }) => {
                return (
                    <div className='flex space-x-2'>
                        <span className='max-w-[500px] truncate font-medium'>
                            {row.getValue('riceQty')}
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
