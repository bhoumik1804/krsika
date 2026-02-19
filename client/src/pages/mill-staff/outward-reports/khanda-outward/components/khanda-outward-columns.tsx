import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns/format'
import { t } from 'i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type KhandaOutward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const khandaOutwardColumns: ColumnDef<KhandaOutward>[] = [
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
                title={t('outward.khandaOutward.form.fields.date', {
                    ns: 'mill-staff',
                })}
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
        accessorKey: 'khandaSaleDealNumber',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t(
                    'outward.khandaOutward.form.fields.khandaSaleDealNumber',
                    {
                        ns: 'mill-staff',
                    }
                )}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('khandaSaleDealNumber')}</div>,
    },
    {
        accessorKey: 'partyName',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('outward.khandaOutward.form.fields.partyName', {
                    ns: 'mill-staff',
                })}
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
        accessorKey: 'brokerName',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('outward.khandaOutward.form.fields.brokerName', {
                    ns: 'mill-staff',
                })}
            />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-36'>
                {row.getValue('brokerName')}
            </LongText>
        ),
        meta: { className: 'w-36' },
    },
    {
        accessorKey: 'gunnyPlastic',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('outward.khandaOutward.form.fields.gunnyPlastic', {
                    ns: 'mill-staff',
                })}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('gunnyPlastic')}</div>
        ),
    },
    {
        accessorKey: 'plasticGunnyWeight',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('outward.khandaOutward.form.fields.plasticWeight', {
                    ns: 'mill-staff',
                })}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>
                {row.getValue('plasticGunnyWeight')}
            </div>
        ),
    },
    {
        accessorKey: 'truckNo',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('outward.khandaOutward.form.fields.truckNo', {
                    ns: 'mill-staff',
                })}
            />
        ),
        cell: ({ row }) => <div>{row.getValue('truckNo')}</div>,
    },
    {
        accessorKey: 'truckRst',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('outward.khandaOutward.form.fields.truckRst', {
                    ns: 'mill-staff',
                })}
            />
        ),
        cell: ({ row }) => <div className=''>{row.getValue('truckRst')}</div>,
    },
    {
        accessorKey: 'truckWeight',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('outward.khandaOutward.form.fields.truckWeight', {
                    ns: 'mill-staff',
                })}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('truckWeight')}</div>
        ),
    },
    {
        accessorKey: 'gunnyWeight',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('outward.khandaOutward.form.fields.gunnyWeight', {
                    ns: 'mill-staff',
                })}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('gunnyWeight')}</div>
        ),
    },
    {
        accessorKey: 'netWeight',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('outward.khandaOutward.form.fields.netWeight', {
                    ns: 'mill-staff',
                })}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('netWeight')}</div>
        ),
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
