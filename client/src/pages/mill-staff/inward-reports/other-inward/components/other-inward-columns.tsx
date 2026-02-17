import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type OtherInward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'

export const useOtherInwardColumns = () => {
    const { t } = useTranslation('mill-staff')

    const columns: ColumnDef<OtherInward>[] = useMemo(
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
                        title={t('otherInward.table.date')}
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
                accessorKey: 'otherPurchaseDealNumber',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('otherInward.table.otherPurchaseDealNumber')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('otherPurchaseDealNumber')}
                    </div>
                ),
            },
            {
                accessorKey: 'partyName',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('otherInward.table.partyName')}
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
                accessorKey: 'itemName',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('otherInward.table.itemName')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('itemName')}
                    </div>
                ),
            },
            {
                accessorKey: 'quantity',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('otherInward.table.quantity')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-center'>
                        {row.getValue('quantity')}
                    </div>
                ),
            },
            {
                accessorKey: 'quantityType',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('otherInward.table.quantityType')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-center'>
                        {row.getValue('quantityType')}
                    </div>
                ),
            },
            {
                accessorKey: 'gunnyNew',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('otherInward.table.gunnyNew')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>{row.getValue('gunnyNew')}</div>
                ),
            },
            {
                accessorKey: 'gunnyOld',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('otherInward.table.gunnyOld')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>{row.getValue('gunnyOld')}</div>
                ),
            },
            {
                accessorKey: 'gunnyPlastic',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('otherInward.table.gunnyPlastic')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.getValue('gunnyPlastic')}
                    </div>
                ),
            },
            {
                accessorKey: 'juteGunnyWeight',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('otherInward.table.juteGunnyWeight')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {(row.getValue('juteGunnyWeight') as number)?.toFixed(
                            2
                        )}
                    </div>
                ),
            },
            {
                accessorKey: 'plasticGunnyWeight',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('otherInward.table.plasticGunnyWeight')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {(
                            row.getValue('plasticGunnyWeight') as number
                        )?.toFixed(2)}
                    </div>
                ),
            },
            {
                accessorKey: 'truckNumber',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('otherInward.table.truckNumber')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('truckNumber')}
                    </div>
                ),
            },
            {
                accessorKey: 'rstNumber',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('otherInward.table.rstNumber')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-nowrap'>
                        {row.getValue('rstNumber')}
                    </div>
                ),
            },
            {
                accessorKey: 'truckWeight',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('otherInward.table.truckWeight')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {(row.getValue('truckWeight') as number)?.toFixed(2)}
                    </div>
                ),
            },
            {
                accessorKey: 'gunnyWeight',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('otherInward.table.gunnyWeight')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {(row.getValue('gunnyWeight') as number)?.toFixed(2)}
                    </div>
                ),
            },
            {
                accessorKey: 'netWeight',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t('otherInward.table.netWeight')}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right font-medium'>
                        {(row.getValue('netWeight') as number)?.toFixed(2)}
                    </div>
                ),
            },
            {
                id: 'actions',
                cell: DataTableRowActions,
            },
        ],
        [t]
    )

    return columns
}
