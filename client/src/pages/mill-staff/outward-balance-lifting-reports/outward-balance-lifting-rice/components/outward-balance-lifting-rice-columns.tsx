import { useMemo } from 'react'
import { formatDate } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { type PrivateRiceOutward } from '../data/types'
import { DataTableRowActions } from './data-table-row-actions'

export function useOutwardBalanceLiftingRiceColumns() {
    const { t } = useTranslation('mill-staff')

    return useMemo<ColumnDef<PrivateRiceOutward>[]>(
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
                accessorKey: 'privateRiceOutwardNumber',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'balanceLifting.outwardRiceSales.outwardNumber',
                            'Outward Number'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <div className='w-[100px] font-medium'>
                        {row.getValue('privateRiceOutwardNumber')}
                    </div>
                ),
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
                        <div className='w-[100px]'>
                            {formatDate(date, 'dd-MM-yyyy')}
                        </div>
                    )
                },
            },
            {
                accessorKey: 'saleNumber',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'balanceLifting.outwardRiceSales.saleNumber',
                            'Sale Number'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <div className='w-[100px]'>
                        {row.getValue('saleNumber') || '-'}
                    </div>
                ),
            },
            {
                accessorKey: 'partyName',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.partyName')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='w-[150px]'>{row.getValue('partyName')}</div>
                ),
            },
            {
                accessorKey: 'truckNumber',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.truckNumber', 'Truck Number')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='w-[120px]'>
                        {row.getValue('truckNumber')}
                    </div>
                ),
            },
            {
                accessorKey: 'netWeight',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('common.netWeight', 'Net Weight')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='w-[100px]'>{row.getValue('netWeight')}</div>
                ),
            },
            {
                id: 'actions',
                cell: ({ row }) => <DataTableRowActions row={row} />,
            },
        ],
        [t]
    )
}
