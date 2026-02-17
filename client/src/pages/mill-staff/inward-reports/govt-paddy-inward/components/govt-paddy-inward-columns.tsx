import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type GovtPaddyInward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export function useGovtPaddyInwardColumns(): ColumnDef<GovtPaddyInward>[] {
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
                    title={t('govtPaddyInward.table.date')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-nowrap'>{row.getValue('date')}</div>
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
            accessorKey: 'doNumber',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtPaddyInward.table.doNumber')}
                />
            ),
            cell: ({ row }) => (
                <LongText className='max-w-36'>
                    {row.getValue('doNumber')}
                </LongText>
            ),
        },
        {
            accessorKey: 'committeeName',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtPaddyInward.table.committeeName')}
                />
            ),
            cell: ({ row }) => (
                <LongText className='max-w-36'>
                    {row.getValue('committeeName')}
                </LongText>
            ),
        },
        {
            accessorKey: 'balanceDo',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtPaddyInward.table.balanceDo')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('balanceDo')}</div>
            ),
        },
        {
            accessorKey: 'gunnyNew',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtPaddyInward.table.gunnyNew')}
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
                    title={t('govtPaddyInward.table.gunnyOld')}
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
                    title={t('govtPaddyInward.table.gunnyPlastic')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('gunnyPlastic')}</div>
            ),
        },
        {
            accessorKey: 'juteWeight',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtPaddyInward.table.juteWeight')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('juteWeight')}</div>
            ),
        },
        {
            accessorKey: 'plasticWeight',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtPaddyInward.table.plasticWeight')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {row.getValue('plasticWeight')}
                </div>
            ),
        },
        {
            accessorKey: 'gunnyWeight',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtPaddyInward.table.gunnyWeight')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('gunnyWeight')}</div>
            ),
        },
        {
            accessorKey: 'truckNumber',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtPaddyInward.table.truckNumber')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-nowrap'>{row.getValue('truckNumber')}</div>
            ),
        },
        {
            accessorKey: 'rstNumber',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtPaddyInward.table.rstNumber')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-nowrap'>{row.getValue('rstNumber')}</div>
            ),
        },
        {
            accessorKey: 'truckLoadWeight',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtPaddyInward.table.truckLoadWeight')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {row.getValue('truckLoadWeight')}
                </div>
            ),
        },
        {
            accessorKey: 'paddyType',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtPaddyInward.table.paddyType')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-nowrap'>{row.getValue('paddyType')}</div>
            ),
        },
        {
            accessorKey: 'paddyMota',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtPaddyInward.table.paddyMota')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('paddyMota')}</div>
            ),
        },
        {
            accessorKey: 'paddyPatla',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtPaddyInward.table.paddyPatla')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('paddyPatla')}</div>
            ),
        },
        {
            accessorKey: 'paddySarna',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtPaddyInward.table.paddySarna')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('paddySarna')}</div>
            ),
        },
        {
            accessorKey: 'paddyMahamaya',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtPaddyInward.table.paddyMahamaya')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {row.getValue('paddyMahamaya')}
                </div>
            ),
        },
        {
            accessorKey: 'paddyRbGold',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtPaddyInward.table.paddyRbGold')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('paddyRbGold')}</div>
            ),
        },
        {
            id: 'actions',
            cell: DataTableRowActions,
        },
    ]
}
