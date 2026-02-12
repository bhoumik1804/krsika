import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type MillingPaddy } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getMillingPaddyColumns = (
    t: TFunction<'millStaff', undefined>
): ColumnDef<MillingPaddy>[] => [
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
        accessorKey: 'paddyType',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.paddyType')}
            />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-36'>
                {row.getValue('paddyType')}
            </LongText>
        ),
        meta: { className: 'w-40' },
    },
    {
        accessorKey: 'hopperInGunny',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.hopperInGunny')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('hopperInGunny') ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'hopperInQintal',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.hopperInQuintal')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('hopperInQintal') ?? '-'}
            </div>
        ),
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
        accessorKey: 'riceQuantity',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.riceQty')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('riceQuantity') ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'ricePercentage',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.ricePercent')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('ricePercentage') ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'khandaQuantity',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.khandaQty')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('khandaQuantity') ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'khandaPercentage',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('tableColumns.khandaPercent')}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('khandaPercentage') ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'kodhaQuantity',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Kodha Quantity (Qtl)'
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('kodhaQuantity') ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'kodhaPercentage',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Kodha (%)' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('kodhaPercentage') ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'bhusaTon',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Bhusa Quantity (Ton)'
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('bhusaTon') ?? '-'}</div>
        ),
    },
    {
        accessorKey: 'bhusaPercentage',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Bhusa (%)' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('bhusaPercentage') ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'nakkhiQuantity',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Nakkhi Quantity (Qtl)'
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('nakkhiQuantity') ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'nakkhiPercentage',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Nakkhi (%)' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('nakkhiPercentage') ?? '-'}
            </div>
        ),
    },
    {
        accessorKey: 'wastagePercentage',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Wastage (%)' />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('wastagePercentage') ?? '-'}
            </div>
        ),
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
