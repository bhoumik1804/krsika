import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type GovtRiceOutward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getGovtRiceOutwardColumns = (
    t: TFunction<'millStaff', undefined>
): ColumnDef<GovtRiceOutward>[] => [
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
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.date')}
            />
        ),
        cell: ({ row }) => (
            <div className='ps-3 text-nowrap'>{row.getValue('date')}</div>
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
                title={t('tableColumns.lotNo')}
            />
        ),
        cell: ({ row }) => (
            <div className='font-mono text-sm'>{row.getValue('lotNo')}</div>
        ),
    },
    {
        accessorKey: 'fciNan',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.fciNan')}
            />
        ),
        cell: ({ row }) => (
            <div className='font-mono text-sm'>{row.getValue('fciNan')}</div>
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'riceType',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.riceType')}
            />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-32'>{row.getValue('riceType')}</LongText>
        ),
    },
    {
        accessorKey: 'gunnyNew',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.gunnyNew')}
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
                title={t('tableColumns.gunnyOld')}
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
                title={t('tableColumns.juteWeight')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {(row.getValue('juteWeight') as number | undefined)?.toFixed(
                    2
                ) ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'truckNo',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.truckNumber')}
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
                title={t('tableColumns.rstNo')}
            />
        ),
        cell: ({ row }) => (
            <div className='font-mono text-sm'>{row.getValue('truckRst')}</div>
        ),
    },
    {
        accessorKey: 'truckWeight',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.truckWeight')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {(row.getValue('truckWeight') as number | undefined)?.toFixed(
                    2
                ) ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'gunnyWeight',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.gunnyWeight')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {(row.getValue('gunnyWeight') as number | undefined)?.toFixed(
                    2
                ) ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'netWeight',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.netWeight')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right font-medium'>
                {(row.getValue('netWeight') as number | undefined)?.toFixed(
                    2
                ) ?? '-'}
            </div>
        ),
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
