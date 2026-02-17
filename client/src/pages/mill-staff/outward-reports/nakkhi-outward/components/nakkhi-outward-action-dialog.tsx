import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNakkhiSalesList } from '@/pages/mill-admin/sales-reports/nakkhi-sales/data/hooks'
import { CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
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
import { useCreateNakkhiOutward, useUpdateNakkhiOutward } from '../data/hooks'
import { nakkhiOutwardSchema, type NakkhiOutward } from '../data/schema'

const useNakkhiSalesWrapper = (params: any) => {
    return useNakkhiSalesList(params.millId, params, {
        enabled: !!params.millId,
    })
}

type NakkhiOutwardActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: NakkhiOutward | null
    millId: string
}

export function NakkhiOutwardActionDialog({
    open,
    onOpenChange,
    currentRow,
    millId,
}: NakkhiOutwardActionDialogProps) {
    const { t } = useTranslation('mill-staff')
    const salesDeals = usePaginatedList(
        millId,
        open,
        {
            useListHook: useNakkhiSalesWrapper,
            extractItems: (data) =>
                data.sales
                    ?.map((s) => s.nakkhiSalesDealNumber)
                    .filter(Boolean) as string[],
            hookParams: { sortBy: 'date', sortOrder: 'desc' },
        },
        currentRow?.nakkhiSaleDealNumber || undefined
    )

    const { data: salesList } = useNakkhiSalesList(
        millId,
        { limit: 1000 },
        { enabled: open }
    )

    const handleDealSelect = (dealNumber: string) => {
        form.setValue('nakkhiSaleDealNumber', dealNumber)
        const selectedDeal = salesList?.sales?.find(
            (sale) => sale.nakkhiSalesDealNumber === dealNumber
        )
        if (selectedDeal) {
            if (selectedDeal.partyName) {
                form.setValue('partyName', selectedDeal.partyName)
            }
            if (selectedDeal.brokerName) {
                form.setValue('brokerName', selectedDeal.brokerName)
            }
        }
    }
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const createMutation = useCreateNakkhiOutward(millId)
    const updateMutation = useUpdateNakkhiOutward(millId)

    const defaultValues = useMemo(
        () => ({
            date: currentRow?.date || format(new Date(), 'yyyy-MM-dd'),
            nakkhiSaleDealNumber: currentRow?.nakkhiSaleDealNumber || '',
            partyName: currentRow?.partyName || '',
            brokerName: currentRow?.brokerName || '',
            rate: currentRow?.rate,
            brokerage: currentRow?.brokerage,
            gunnyPlastic: currentRow?.gunnyPlastic,
            plasticGunnyWeight: currentRow?.plasticGunnyWeight,
            truckNo: currentRow?.truckNo || '',
            truckRst: currentRow?.truckRst || '',
            truckWeight: currentRow?.truckWeight,
            gunnyWeight: currentRow?.gunnyWeight,
            netWeight: currentRow?.netWeight,
        }),
        [currentRow]
    )

    const form = useForm<NakkhiOutward>({
        resolver: zodResolver(nakkhiOutwardSchema),
        defaultValues,
    })

    useEffect(() => {
        if (open) {
            if (currentRow) {
                form.reset(currentRow)
            } else {
                form.reset(defaultValues)
            }
        }
    }, [currentRow, form, open, defaultValues])

    const onSubmit = (data: NakkhiOutward) => {
        const submissionData = {
            ...data,
            partyName: data.partyName || undefined,
            brokerName: data.brokerName || undefined,
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
                        return t('common.success')
                    },
                    error: t('common.error'),
                }
            )
        } else {
            toast.promise(createMutation.mutateAsync(submissionData), {
                loading: t('common.adding'),
                success: () => {
                    onOpenChange(false)
                    return t('common.success')
                },
                error: t('common.error'),
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t('nakkhiOutward.editRecord')
                            : t('nakkhiOutward.addRecord')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t('common.updateDetails')
                            : t('common.enterDetails')}
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
                                            {t('nakkhiOutward.form.date')}
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
                                                                  'common.pickADate'
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
                                name='nakkhiSaleDealNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'nakkhiOutward.form.nakkhiSaleDealNumber'
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
                                                    'nakkhiOutward.form.enterDealNumber'
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
                                name='partyName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('nakkhiOutward.form.partyName')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'nakkhiOutward.form.searchParty'
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
                                            {t('nakkhiOutward.form.brokerName')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'nakkhiOutward.form.searchBroker'
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
                                name='rate'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('nakkhiOutward.form.rate')}
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
                                name='brokerage'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('nakkhiOutward.form.brokerage')}
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
                                                'nakkhiOutward.form.gunnyPlastic'
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
                                name='plasticGunnyWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'nakkhiOutward.form.plasticGunnyWeight'
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
                                            {t('nakkhiOutward.form.truckNo')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'nakkhiOutward.form.enterTruckNo'
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
                                            {t('nakkhiOutward.form.rstNo')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'nakkhiOutward.form.enterRstNo'
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
                                                'nakkhiOutward.form.truckWeight'
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
                                                'nakkhiOutward.form.gunnyWeight'
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
                                            {t('nakkhiOutward.form.netWeight')}
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
