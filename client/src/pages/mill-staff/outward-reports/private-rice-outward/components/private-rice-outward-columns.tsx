import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type PrivateRiceOutward } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const PrivateRiceOutwardColumns =
    (): ColumnDef<PrivateRiceOutward>[] => {
        const { t } = useTranslation('mill-staff')

        return [
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
                        onCheckedChange={(value) =>
                            row.toggleSelected(!!value)
                        }
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
                        title={t(
                            'outward.privateRiceOutward.form.fields.date'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <div className='ps-3 text-nowrap'>
                        {format(
                            new Date(row.getValue('date')),
                            'yyyy-MM-dd'
                        )}
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
                accessorKey: 'riceSaleDealNumber',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'outward.privateRiceOutward.form.fields.riceSaleDealNumber'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <div className='font-mono text-sm'>
                        {row.getValue('riceSaleDealNumber')}
                    </div>
                ),
            },
            {
                accessorKey: 'partyName',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'outward.privateRiceOutward.form.fields.partyName'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <LongText className='max-w-32'>
                        {row.getValue('partyName')}
                    </LongText>
                ),
            },
            {
                accessorKey: 'brokerName',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'outward.privateRiceOutward.form.fields.brokerName'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <LongText className='max-w-32'>
                        {row.getValue('brokerName')}
                    </LongText>
                ),
            },
            {
                accessorKey: 'lotNo',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'outward.privateRiceOutward.form.fields.lotNo'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <div className='font-mono text-sm'>
                        {row.getValue('lotNo')}
                    </div>
                ),
            },
            {
                accessorKey: 'fciNan',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'outward.privateRiceOutward.form.fields.fciNan'
                        )}
                    />
                ),
                cell: ({ row }) => {
                    const value = row.getValue('fciNan') as string
                    return (
                        <Badge variant='outline' className='font-mono'>
                            {value}
                        </Badge>
                    )
                },
            },
            {
                accessorKey: 'riceType',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'outward.privateRiceOutward.form.fields.riceType'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <LongText className='max-w-32'>
                        {row.getValue('riceType')}
                    </LongText>
                ),
            },
            {
                accessorKey: 'riceQty',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'outward.privateRiceOutward.form.fields.riceQty'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {(row.getValue('riceQty') as number)?.toFixed(2)}
                    </div>
                ),
            },
            {
                accessorKey: 'gunnyNew',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'outward.privateRiceOutward.form.fields.gunnyNew'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.getValue('gunnyNew')}
                    </div>
                ),
            },
            {
                accessorKey: 'gunnyOld',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'outward.privateRiceOutward.form.fields.gunnyOld'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.getValue('gunnyOld')}
                    </div>
                ),
            },
            {
                accessorKey: 'gunnyPlastic',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'outward.privateRiceOutward.form.fields.gunnyPlastic'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {row.getValue('gunnyPlastic')}
                    </div>
                ),
            },
            {
                accessorKey: 'juteWeight',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'outward.privateRiceOutward.form.fields.juteWeight'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {(row.getValue('juteWeight') as number)?.toFixed(2)}
                    </div>
                ),
            },
            {
                accessorKey: 'plasticWeight',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'outward.privateRiceOutward.form.fields.plasticWeight'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <div className='text-right'>
                        {(row.getValue('plasticWeight') as number)?.toFixed(2)}
                    </div>
                ),
            },
            {
                accessorKey: 'truckNumber',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'outward.privateRiceOutward.form.fields.truckNumber'
                        )}
                    />
                ),
                cell: ({ row }) => (
                    <div className='font-mono text-sm text-nowrap'>
                        {row.getValue('truckNumber')}
                    </div>
                ),
            },
            {
                accessorKey: 'truckRst',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title={t(
                            'outward.privateRiceOutward.form.fields.truckRst'
                        )}
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
                        title={t(
                            'outward.privateRiceOutward.form.fields.truckWeight'
                        )}
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
                        title={t(
                            'outward.privateRiceOutward.form.fields.gunnyWeight'
                        )}
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
                        title={t(
                            'outward.privateRiceOutward.form.fields.netWeight'
                        )}
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
        ]
    }
