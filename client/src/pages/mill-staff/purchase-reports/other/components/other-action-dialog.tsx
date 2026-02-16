import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBrokerList } from '@/pages/mill-admin/input-reports/broker-report/data/hooks'
import { usePartyList } from '@/pages/mill-admin/input-reports/party-report/data/hooks'
import { CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { otherPurchaseAndSalesQtyTypeOptions } from '@/constants/purchase-form'
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
import { useCreateOtherPurchase, useUpdateOtherPurchase } from '../data/hooks'
import { otherPurchaseSchema, type OtherPurchase } from '../data/schema'
import { useOther } from './other-provider'

type OtherActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: OtherPurchase | null
}

export function OtherActionDialog({
    open,
    onOpenChange,
    currentRow,
}: OtherActionDialogProps) {
    const { t } = useTranslation('millStaff')
    const { millId } = useOther()
    const { mutateAsync: createOtherPurchase, isPending: isCreating } =
        useCreateOtherPurchase(millId)
    const { mutateAsync: updateOtherPurchase, isPending: isUpdating } =
        useUpdateOtherPurchase(millId)

    const party = usePaginatedList(
        millId,
        open,
        {
            useListHook: usePartyList,
            extractItems: (data) =>
                data.parties.map((p: { partyName: string }) => p.partyName),
            hookParams: { sortBy: 'partyName', sortOrder: 'asc' },
        },
        currentRow?.partyName
    )

    const broker = usePaginatedList(
        millId,
        open,
        {
            useListHook: useBrokerList,
            extractItems: (data) =>
                data.brokers.map((b: { brokerName: string }) => b.brokerName),
        },
        currentRow?.brokerName
    )

    const isEditing = !!currentRow
    const isLoading = isCreating || isUpdating
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const form = useForm<OtherPurchase>({
        resolver: zodResolver(otherPurchaseSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            partyName: '',
            brokerName: '',
            otherPurchaseName: '',
            otherPurchaseQty: '' as unknown as number,
            qtyType: '',
            rate: '' as unknown as number,
            discountPercent: '' as unknown as number,
            gst: '' as unknown as number,
        } as OtherPurchase,
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
                    otherPurchaseName: '',
                    otherPurchaseQty: '' as unknown as number,
                    qtyType: '',
                    rate: '' as unknown as number,
                    discountPercent: '' as unknown as number,
                    gst: '' as unknown as number,
                } as OtherPurchase)
            }
        }
    }, [currentRow, open, form])

    const onSubmit = async (data: OtherPurchase) => {
        try {
            if (isEditing && currentRow?._id) {
                await updateOtherPurchase({
                    purchaseId: currentRow._id,
                    data,
                })
            } else {
                await createOtherPurchase(data)
            }
            onOpenChange(false)
            form.reset()
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t('otherPurchase.form.editTitle')
                            : t('otherPurchase.form.addTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t('otherPurchase.form.editDescription')
                            : t('otherPurchase.form.addDescription')}
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
                                                {t('otherPurchase.form.date')}
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
                                                                      'otherPurchase.form.placeholders.select'
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
                                                {t(
                                                    'otherPurchase.form.partyName'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <PaginatedCombobox
                                                    value={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    paginatedList={party}
                                                    placeholder={t(
                                                        'otherPurchase.form.placeholders.party'
                                                    )}
                                                    emptyText={t(
                                                        'common.noResults'
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
                                                    'otherPurchase.form.brokerName'
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
                                                        'otherPurchase.form.placeholders.broker'
                                                    )}
                                                    emptyText={t(
                                                        'common.noResults'
                                                    )}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='otherPurchaseName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'otherPurchase.form.itemName'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        'otherPurchase.form.placeholders.item'
                                                    )}
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='otherPurchaseQty'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t('otherPurchase.form.qty')}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder={t(
                                                        'otherPurchase.form.placeholders.qty'
                                                    )}
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target
                                                                .valueAsNumber
                                                        field.onChange(
                                                            isNaN(val)
                                                                ? undefined
                                                                : val
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
                                                {t(
                                                    'otherPurchase.form.qtyType'
                                                )}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || ''}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue
                                                            placeholder={t(
                                                                'otherPurchase.form.placeholders.select'
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
                                                                {t(
                                                                    `otherPurchase.options.qtyType.${
                                                                        option.value ===
                                                                        'क्विंटल'
                                                                            ? 'quintal'
                                                                            : option.value ===
                                                                                'कि.ग्रा.'
                                                                              ? 'kg'
                                                                              : option.value ===
                                                                                  'टन'
                                                                                ? 'ton'
                                                                                : option.value ===
                                                                                    'नग'
                                                                                  ? 'nag'
                                                                                  : 'other'
                                                                    }`
                                                                )}
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
                                                {t('otherPurchase.form.rate')}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder={t(
                                                        'otherPurchase.form.placeholders.rate'
                                                    )}
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target
                                                                .valueAsNumber
                                                        field.onChange(
                                                            isNaN(val)
                                                                ? undefined
                                                                : val
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
                                                    'otherPurchase.form.discount'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder={t(
                                                        'otherPurchase.form.placeholders.discount'
                                                    )}
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target
                                                                .valueAsNumber
                                                        field.onChange(
                                                            isNaN(val)
                                                                ? undefined
                                                                : val
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
                                                {t('otherPurchase.form.gst')}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder={t(
                                                        'otherPurchase.form.placeholders.gst'
                                                    )}
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target
                                                                .valueAsNumber
                                                        field.onChange(
                                                            isNaN(val)
                                                                ? undefined
                                                                : val
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
                                disabled={isLoading}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button type='submit' disabled={isLoading}>
                                {isLoading
                                    ? isEditing
                                        ? t('common.updating')
                                        : t('common.adding')
                                    : isEditing
                                      ? t('otherPurchase.form.editTitle')
                                      : t('otherPurchase.form.addTitle')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
