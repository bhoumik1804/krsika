import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type GovtRiceOutward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export function useGovtRiceOutwardColumns(): ColumnDef<GovtRiceOutward>[] {
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
                    aria-label={t('common.selectAll')}
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
                    aria-label={t('common.selectRow')}
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
                    title={t('govtRiceOutward.table.date')}
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
            accessorKey: 'lotNo',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtRiceOutward.table.lotNo')}
                />
            ),
            cell: ({ row }) => <div>{row.getValue('lotNo')}</div>,
        },
        {
            accessorKey: 'fciNan',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtRiceOutward.table.fciNan')}
                />
            ),
            cell: ({ row }) => (
                <LongText className='max-w-36'>
                    {row.getValue('fciNan')}
                </LongText>
            ),
            meta: { className: 'w-36' },
        },
        {
            accessorKey: 'riceType',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtRiceOutward.table.riceType')}
                />
            ),
            cell: ({ row }) => {
                const riceType = row.getValue('riceType') as string
                return riceType ? (
                    <Badge variant='outline'>{riceType}</Badge>
                ) : null
            },
        },
        {
            accessorKey: 'gunnyNew',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtRiceOutward.table.gunnyNew')}
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
                    title={t('govtRiceOutward.table.gunnyOld')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>{row.getValue('gunnyOld')}</div>
            ),
        },
        {
            accessorKey: 'juteWeight',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtRiceOutward.table.juteWeight')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {(row.getValue('juteWeight') as number)?.toFixed(3)}
                </div>
            ),
        },
        {
            accessorKey: 'truckNo',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtRiceOutward.table.truckNo')}
                />
            ),
            cell: ({ row }) => (
                <div className='font-mono text-sm text-nowrap'>
                    {row.getValue('truckNo')}
                </div>
            ),
        },
        {
            accessorKey: 'truckRst',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtRiceOutward.table.rstNo')}
                />
            ),
            cell: ({ row }) => (
                <div className='font-mono text-sm'>
                    {row.getValue('truckRst')}
                </div>
            ),
        },
        {
            accessorKey: 'truckWeight',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtRiceOutward.table.truckWeight')}
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
                    title={t('govtRiceOutward.table.gunnyWeight')}
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
                    title={t('govtRiceOutward.table.netWeight')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-right'>
                    {(row.getValue('netWeight') as number)?.toFixed(2)}
                </div>
            ),
        },
        {
            id: 'actions',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('govtRiceOutward.table.actions')}
                />
            ),
            cell: DataTableRowActions,
        },
    ]
}
