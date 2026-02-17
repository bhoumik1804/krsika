import { useMemo } from 'react'
import { format } from 'date-fns'
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
                            {format(date, 'dd-MM-yyyy')}
                        </div>
                    )
                },
            },
            {
                accessorKey: 'riceSalesDealNumber',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('outwardRiceSales.table.riceSalesDealNumber')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='w-[100px]'>
                        {row.getValue('riceSalesDealNumber') || '-'}
                    </div>
                ),
            },
            {
                accessorKey: 'partyName',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('outwardRiceSales.table.partyName')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='w-[150px]'>{row.getValue('partyName')}</div>
                ),
            },
            {
                accessorKey: 'brokerName',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('outwardRiceSales.brokerName')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='w-[120px]'>
                        {row.getValue('brokerName')}
                    </div>
                ),
            },
            {
                accessorKey: 'deliveryType',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('outwardRiceSales.table.deliveryType')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='w-[100px]'>
                        {row.getValue('deliveryType')}
                    </div>
                ),
            },
            {
                accessorKey: 'lotOrOther',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('outwardRiceSales.table.lotOrOther')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='w-[100px]'>
                        {row.getValue('lotOrOther')}
                    </div>
                ),
            },
            {
                accessorKey: 'fciOrNan',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('outwardRiceSales.table.fciOrNan')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='w-[100px]'>{row.getValue('fciOrNan')}</div>
                ),
            },
            {
                accessorKey: 'riceType',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('outwardRiceSales.table.riceType')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='w-[100px]'>{row.getValue('riceType')}</div>
                ),
            },
            {
                accessorKey: 'riceQty',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('outwardRiceSales.table.riceQty')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='w-[100px]'>{row.getValue('riceQty')}</div>
                ),
            },
            {
                accessorKey: 'outwardQty',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('outwardRiceSales.table.outwardQty')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='w-[100px]'>
                        {row.getValue('outwardQty')}
                    </div>
                ),
            },
            {
                accessorKey: 'balanceOutward',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('outwardRiceSales.table.balanceOutward')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='w-[100px]'>{row.getValue('riceQty')}</div>
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
