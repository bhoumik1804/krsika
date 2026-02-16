import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBrokerList } from '@/pages/mill-admin/input-reports/broker-report/data/hooks'
import { usePartyList } from '@/pages/mill-admin/input-reports/party-report/data/hooks'
import { CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { otherPurchaseAndSalesQtyTypeOptions } from '@/constants/sale-form'
import { usePaginatedList } from '@/hooks/use-paginated-list'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PaginatedCombobox } from '@/components/ui/paginated-combobox'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useCreateOtherSales, useUpdateOtherSales } from '../data/hooks'
import { otherSalesSchema, type OtherSales } from '../data/schema'

type OtherSalesActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: OtherSales | null
}

export function OtherSalesActionDialog({
    open,
    onOpenChange,
    currentRow,
}: OtherSalesActionDialogProps) {
    const { t } = useTranslation('millStaff')
    const { millId } = useParams<{ millId: string }>()
    const party = usePaginatedList(
        millId || '',
        open,
        {
            useListHook: usePartyList,
            extractItems: (data) =>
                data.parties
                    .map((c) => c.partyName)
                    .filter(Boolean) as string[],
            hookParams: { sortBy: 'partyName', sortOrder: 'asc' },
        },
        currentRow?.partyName
    )

    const broker = usePaginatedList(
        millId || '',
        open,
        {
            useListHook: useBrokerList,
            extractItems: (data) =>
                data.brokers
                    .map((c) => c.brokerName)
                    .filter(Boolean) as string[],
        },
        currentRow?.brokerName
    )

    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const createOtherSalesMutation = useCreateOtherSales(millId || '')
    const updateOtherSalesMutation = useUpdateOtherSales(millId || '')

    const form = useForm<OtherSales>({
        resolver: zodResolver(otherSalesSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            partyName: '',
            brokerName: '',
            otherSaleName: '',
            otherSaleQty: 0,
            qtyType: '',
            rate: 0,
            discountPercent: 0,
            gst: 0,
        },
    })

    useEffect(() => {
        if (open) {
            if (currentRow) {
                form.reset(currentRow)
            } else {
                form.reset({
                    date: format(new Date(), 'yyyy-MM-dd'),
                    partyName: '',
                    brokerName: '',
                    otherSaleName: '',
                    otherSaleQty: 0,
                    qtyType: '',
                    rate: 0,
                    discountPercent: 0,
                    gst: 0,
                })
            }
        }
    }, [currentRow, open, form])

    const onSubmit = (data: OtherSales) => {
        const submissionData = {
            ...data,
            partyName: data.partyName || undefined,
            brokerName: data.brokerName || undefined,
        }

        if (isEditing) {
            updateOtherSalesMutation.mutate(submissionData, {
                onSuccess: () => {
                    onOpenChange(false)
                },
            })
        } else {
            createOtherSalesMutation.mutate(submissionData, {
                onSuccess: () => {
                    onOpenChange(false)
                },
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t('otherSales.form.editTitle')
                            : t('otherSales.form.addTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t('otherSales.form.editDescription')
                            : t('otherSales.form.addDescription')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <div className='space-y-6'>
                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='date'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t('otherSales.form.date')}
                                            </FormLabel>
                                            <Popover
                                                open={datePopoverOpen}
                                                onOpenChange={
                                                    setDatePopoverOpen
                                                }
                                            >
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant='outline'
                                                            className='w-full justify-start text-left font-normal'
                                                        >
                                                            <CalendarIcon className='mr-2 h-4 w-4' />
                                                            {field.value
                                                                ? format(
                                                                      new Date(
                                                                          field.value
                                                                      ),
                                                                      'MMM dd, yyyy'
                                                                  )
                                                                : t(
                                                                      'otherSales.form.placeholders.date'
                                                                  )}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className='w-auto p-0'
                                                    align='start'
                                                >
                                                    <Calendar
                                                        mode='single'
                                                        selected={
                                                            field.value
                                                                ? new Date(
                                                                      field.value
                                                                  )
                                                                : undefined
                                                        }
                                                        onSelect={(date) => {
                                                            field.onChange(
                                                                date
                                                                    ? format(
                                                                          date,
                                                                          'yyyy-MM-dd'
                                                                      )
                                                                    : ''
                                                            )
                                                            setDatePopoverOpen(
                                                                false
                                                            )
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='partyName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t('otherSales.form.partyName')}
                                            </FormLabel>
                                            <FormControl>
                                                <PaginatedCombobox
                                                    value={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    paginatedList={party}
                                                    placeholder={t(
                                                        'otherSales.form.placeholders.party'
                                                    )}
                                                    emptyText={t(
                                                        'otherSales.form.placeholders.noParties'
                                                    )}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='brokerName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'otherSales.form.brokerName'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <PaginatedCombobox
                                                    value={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    paginatedList={broker}
                                                    placeholder={t(
                                                        'otherSales.form.placeholders.broker'
                                                    )}
                                                    emptyText={t(
                                                        'otherSales.form.placeholders.noBrokers'
                                                    )}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='otherSaleName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t('otherSales.form.itemName')}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        'otherSales.form.placeholders.itemName'
                                                    )}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='otherSaleQty'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t('otherSales.form.quantity')}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    {...field}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target
                                                                .valueAsNumber
                                                        field.onChange(
                                                            isNaN(val) ? 0 : val
                                                        )
                                                    }}
                                                    onWheel={(e) =>
                                                        e.currentTarget.blur()
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='qtyType'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t('otherSales.form.qtyType')}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue
                                                            placeholder={t(
                                                                'common.select'
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className='w-full'>
                                                    {otherPurchaseAndSalesQtyTypeOptions.map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
                                                            >
                                                                {option.label}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='rate'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t('otherSales.form.rate')}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    {...field}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target
                                                                .valueAsNumber
                                                        field.onChange(
                                                            isNaN(val) ? 0 : val
                                                        )
                                                    }}
                                                    onWheel={(e) =>
                                                        e.currentTarget.blur()
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='discountPercent'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'otherSales.form.discountPercent'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    {...field}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target
                                                                .valueAsNumber
                                                        field.onChange(
                                                            isNaN(val) ? 0 : val
                                                        )
                                                    }}
                                                    onWheel={(e) =>
                                                        e.currentTarget.blur()
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='gst'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t('otherSales.form.gst')}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    {...field}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target
                                                                .valueAsNumber
                                                        field.onChange(
                                                            isNaN(val) ? 0 : val
                                                        )
                                                    }}
                                                    onWheel={(e) =>
                                                        e.currentTarget.blur()
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => onOpenChange(false)}
                            >
                                {t('otherSales.form.buttons.cancel')}
                            </Button>
                            <Button
                                type='submit'
                                disabled={
                                    createOtherSalesMutation.isPending ||
                                    updateOtherSalesMutation.isPending
                                }
                            >
                                {isEditing
                                    ? updateOtherSalesMutation.isPending
                                        ? t('otherSales.form.buttons.updating')
                                        : t('otherSales.form.buttons.update')
                                    : createOtherSalesMutation.isPending
                                      ? t('otherSales.form.buttons.adding')
                                      : t('otherSales.form.buttons.add')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
