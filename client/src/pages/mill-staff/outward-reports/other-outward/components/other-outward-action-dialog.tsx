import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useOtherSalesList } from '@/pages/mill-admin/sales-reports/other-sales/data/hooks'
import { CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
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
import { useCreateOtherOutward, useUpdateOtherOutward } from '../data/hooks'
import { otherOutwardSchema, type OtherOutward } from '../data/schema'

const useOtherSalesWrapper = (params: any) => {
    return useOtherSalesList(params.millId, params, {
        enabled: !!params.millId,
    })
}

type OtherOutwardActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: OtherOutward | null
    millId: string
}

export function OtherOutwardActionDialog({
    open,
    onOpenChange,
    currentRow,
    millId,
}: OtherOutwardActionDialogProps) {
    const { t } = useTranslation('mill-staff')
    const salesDeals = usePaginatedList(
        millId || '',
        open,
        {
            useListHook: useOtherSalesWrapper,
            extractItems: (data) =>
                data.sales
                    ?.map((s) => s.otherSalesDealNumber)
                    .filter(Boolean) as string[],
            hookParams: { sortBy: 'date', sortOrder: 'desc' },
        },
        currentRow?.otherSaleDealNumber || undefined
    )

    const { data: salesList } = useOtherSalesList(
        millId || '',
        { limit: 1000 },
        { enabled: open }
    )

    const handleDealSelect = (dealNumber: string) => {
        form.setValue('otherSaleDealNumber', dealNumber)
        const selectedDeal = salesList?.sales?.find(
            (sale) => sale.otherSalesDealNumber === dealNumber
        )
        if (selectedDeal) {
            if (selectedDeal.partyName) {
                form.setValue('partyName', selectedDeal.partyName)
            }
            if (selectedDeal.brokerName) {
                form.setValue('brokerName', selectedDeal.brokerName)
            }
            if (selectedDeal.otherSaleName) {
                form.setValue('itemName', selectedDeal.otherSaleName)
            }
        }
    }
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const createMutation = useCreateOtherOutward(millId)
    const updateMutation = useUpdateOtherOutward(millId)

    const defaultValues = useMemo(
        () => ({
            date: format(new Date(), 'yyyy-MM-dd'),
            otherSaleDealNumber: '',
            itemName: '',
            quantity: undefined,
            quantityType: '',
            partyName: '',
            brokerName: '',
            gunnyNew: undefined,
            gunnyOld: undefined,
            gunnyPlastic: undefined,
            juteGunnyWeight: undefined,
            plasticGunnyWeight: undefined,
            truckNo: '',
            truckRst: '',
            truckWeight: undefined,
            gunnyWeight: undefined,
            netWeight: undefined,
        }),
        []
    )

    const form = useForm<OtherOutward>({
        resolver: zodResolver(otherOutwardSchema),
        defaultValues,
    })

    useEffect(() => {
        if (open) {
            if (currentRow) {
                form.reset({
                    ...currentRow,
                    date: currentRow.date
                        ? format(new Date(currentRow.date), 'yyyy-MM-dd')
                        : '',
                })
            } else {
                form.reset(defaultValues)
            }
        }
    }, [currentRow, form, defaultValues, open])

    const onSubmit = (data: OtherOutward) => {
        const { _id, ...submitData } = data
        const submissionData = {
            ...submitData,
            partyName: submitData.partyName || undefined,
            brokerName: submitData.brokerName || undefined,
        }

        if (isEditing && currentRow?._id) {
            toast.promise(
                updateMutation.mutateAsync({
                    id: currentRow._id,
                    data: submissionData,
                }),
                {
                    loading: t('common.updating'),
                    success: () => {
                        onOpenChange(false)
                        return t('common.updatedSuccessfully')
                    },
                    error: t('common.failedToUpdate'),
                }
            )
        } else {
            toast.promise(createMutation.mutateAsync(submissionData), {
                loading: t('common.adding'),
                success: () => {
                    onOpenChange(false)
                    return t('common.addedSuccessfully')
                },
                error: t('common.failedToAdd'),
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t('outward.otherOutward.form.title', {
                                  context: 'edit',
                              })
                            : t('outward.otherOutward.form.title', {
                                  context: 'add',
                              })}
                    </DialogTitle>
                    <DialogDescription>
                        {t('outward.otherOutward.form.description')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <div className='grid grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name='date'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.otherOutward.form.fields.date'
                                            )}
                                        </FormLabel>
                                        <Popover
                                            open={datePopoverOpen}
                                            onOpenChange={setDatePopoverOpen}
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
                                                                  'common.pickDate'
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
                                name='otherSaleDealNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.otherOutward.form.fields.otherSaleDealNumber'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <PaginatedCombobox
                                                value={field.value || undefined}
                                                onValueChange={(value) =>
                                                    handleDealSelect(value)
                                                }
                                                paginatedList={salesDeals}
                                                placeholder={t(
                                                    'common.enterValue'
                                                )}
                                                emptyText={t(
                                                    'outward.otherOutward.form.fields.otherSaleDealNumber.emptyText'
                                                )}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='itemName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.otherOutward.form.fields.itemName'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'common.enterValue'
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
                                name='quantity'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.otherOutward.form.fields.quantity'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.valueAsNumber
                                                    )
                                                }
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
                                name='quantityType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.otherOutward.form.fields.quantityType'
                                            )}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={
                                                field.value || undefined
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue
                                                        placeholder={t(
                                                            'common.enterValue'
                                                        )}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='w-full'>
                                                {otherPurchaseAndSalesQtyTypeOptions.map(
                                                    (type) => (
                                                        <SelectItem
                                                            key={type.value}
                                                            value={type.value}
                                                        >
                                                            {type.label}
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
                                name='partyName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.otherOutward.form.fields.partyName'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'common.enterValue'
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
                                name='brokerName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.otherOutward.form.fields.brokerName'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'common.enterValue'
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
                                name='gunnyNew'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.otherOutward.form.fields.gunnyNew'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.valueAsNumber
                                                    )
                                                }
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
                                name='gunnyOld'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.otherOutward.form.fields.gunnyOld'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.valueAsNumber
                                                    )
                                                }
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
                                name='gunnyPlastic'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.otherOutward.form.fields.gunnyPlastic'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.valueAsNumber
                                                    )
                                                }
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
                                name='juteGunnyWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.otherOutward.form.fields.juteWeight'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.001'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.valueAsNumber
                                                    )
                                                }
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
                                name='plasticGunnyWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.otherOutward.form.fields.plasticWeight'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.001'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.valueAsNumber
                                                    )
                                                }
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
                                name='truckNo'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.otherOutward.form.fields.truckNo'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'common.enterValue'
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
                                name='truckRst'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.otherOutward.form.fields.truckRst'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'common.enterValue'
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
                                name='truckWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.otherOutward.form.fields.truckWeight'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.valueAsNumber
                                                    )
                                                }
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
                                name='gunnyWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.otherOutward.form.fields.gunnyWeight'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.valueAsNumber
                                                    )
                                                }
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
                                name='netWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.otherOutward.form.fields.netWeight'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'common.enterValue'
                                                )}
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.valueAsNumber
                                                    )
                                                }
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
                        <DialogFooter>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => onOpenChange(false)}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button type='submit'>
                                {isEditing
                                    ? t('common.update')
                                    : t('common.add')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
