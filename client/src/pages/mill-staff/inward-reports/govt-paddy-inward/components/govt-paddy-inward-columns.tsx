import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { t } from 'i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type GovtPaddyInward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const govtPaddyInwardColumns: ColumnDef<GovtPaddyInward>[] = [
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
                title={t('inward.govtPaddyInward.form.fields.date', {
                    ns: 'mill-staff',
                })}
            />
        ),
        cell: ({ row }) => (
            <div className='text-nowrap'>
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
        accessorKey: 'doNumber',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('inward.govtPaddyInward.form.fields.doNumber', {
                    ns: 'mill-staff',
                })}
            />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-36'>{row.getValue('doNumber')}</LongText>
        ),
    },
    {
        accessorKey: 'committeeName',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('inward.govtPaddyInward.form.fields.committeeName', {
                    ns: 'mill-staff',
                })}
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
                title={t('inward.govtPaddyInward.form.fields.balanceDo', {
                    ns: 'mill-staff',
                })}
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
                title={t('inward.govtPaddyInward.form.fields.gunnyNew', {
                    ns: 'mill-staff',
                })}
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
                title={t('inward.govtPaddyInward.form.fields.gunnyOld', {
                    ns: 'mill-staff',
                })}
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
                title={t('inward.govtPaddyInward.form.fields.gunnyPlastic', {
                    ns: 'mill-staff',
                })}
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
                title={t('inward.govtPaddyInward.form.fields.juteWeight', {
                    ns: 'mill-staff',
                })}
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
                title={t('inward.govtPaddyInward.form.fields.plasticWeight', {
                    ns: 'mill-staff',
                })}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('plasticWeight')}</div>
        ),
    },
    {
        accessorKey: 'gunnyWeight',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('inward.govtPaddyInward.form.fields.gunnyWeight', {
                    ns: 'mill-staff',
                })}
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
                title={t('inward.govtPaddyInward.form.fields.truckNumber', {
                    ns: 'mill-staff',
                })}
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
                title={t('inward.govtPaddyInward.form.fields.rstNumber', {
                    ns: 'mill-staff',
                })}
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
                title={t('inward.govtPaddyInward.form.fields.truckLoadWeight', {
                    ns: 'mill-staff',
                })}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('truckLoadWeight')}</div>
        ),
    },
    {
        accessorKey: 'paddyType',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('inward.govtPaddyInward.form.fields.paddyType', {
                    ns: 'mill-staff',
                })}
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
                title={t('inward.govtPaddyInward.form.fields.paddyMota', {
                    ns: 'mill-staff',
                })}
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
                title={t('inward.govtPaddyInward.form.fields.paddyPatla', {
                    ns: 'mill-staff',
                })}
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
                title={t('inward.govtPaddyInward.form.fields.paddySarna', {
                    ns: 'mill-staff',
                })}
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
                title={t('inward.govtPaddyInward.form.fields.paddyMahamaya', {
                    ns: 'mill-staff',
                })}
            />
        ),
        cell: ({ row }) => (
            <div className='text-right'>{row.getValue('paddyMahamaya')}</div>
        ),
    },
    {
        accessorKey: 'paddyRbGold',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title={t('inward.govtPaddyInward.form.fields.paddyRbGold', {
                    ns: 'mill-staff',
                })}
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
