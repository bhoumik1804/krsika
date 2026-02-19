import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import '@/constants'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type LabourInward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'

export function LabourInwardColumns(): ColumnDef<LabourInward>[] {
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
            className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
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
            <DataTableColumnHeader column={column} title={t('labourCostReports.inward.form.fields.date')} />
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
        accessorKey: 'inwardType',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('labourCostReports.inward.form.fields.inwardType')} />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>{row.getValue('inwardType')}</div>
        ),
        meta: { className: 'w-36' },
    },
    {
        accessorKey: 'truckNumber',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('labourCostReports.inward.form.fields.truckNo')} />
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
            <DataTableColumnHeader column={column} title={t('labourCostReports.inward.form.fields.numberOfBags')} />
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
                title={t('labourCostReports.inward.form.fields.gunnyBundleCount')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('numberOfGunnyBundle') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'unloadingRate',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('labourCostReports.inward.form.fields.unloadingRate')} />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('unloadingRate')}</div>
        ),
    },
    {
        accessorKey: 'stackingRate',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('labourCostReports.inward.form.fields.stackingRate')} />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('stackingRate')}</div>
        ),
    },
    {
        accessorKey: 'labourGroupName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('labourCostReports.inward.form.fields.hamalRejaToliName')} />
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
