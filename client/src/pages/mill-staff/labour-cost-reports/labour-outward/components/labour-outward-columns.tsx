import { type ColumnDef } from '@tanstack/react-table'
import '@/constants'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type LabourOutward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'

export const useLabourOutwardColumns = (): ColumnDef<LabourOutward>[] => {
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
                    title={t('labourOutward.table.date')}
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
            accessorKey: 'outwardType',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('labourOutward.table.outwardType')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-nowrap'>{row.getValue('outwardType')}</div>
            ),
            meta: { className: 'w-36' },
        },
        {
            accessorKey: 'truckNumber',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('labourOutward.table.truckNumber')}
                />
            ),
            cell: ({ row }) => (
                <div className='font-mono text-sm text-nowrap'>
                    {row.getValue('truckNumber')}
                </div>
            ),
        },
        {
            accessorKey: 'totalGunny',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('labourOutward.table.totalGunny')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {row.getValue('totalGunny') || '-'}
                </div>
            ),
        },
        {
            accessorKey: 'numberOfGunnyBundle',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('labourOutward.table.numberOfGunnyBundle')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {row.getValue('numberOfGunnyBundle') || '-'}
                </div>
            ),
        },
        {
            accessorKey: 'loadingRate',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('labourOutward.table.loadingRate')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('loadingRate')}</div>
            ),
        },
        {
            accessorKey: 'dhulaiRate',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('labourOutward.table.dhulaiRate')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('dhulaiRate')}</div>
            ),
        },
        {
            accessorKey: 'labourGroupName',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('labourOutward.table.labourGroupName')}
                />
            ),
            cell: ({ row }) => (
                <LongText className='max-w-36'>
                    {row.getValue('labourGroupName')}
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
