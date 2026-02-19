import { useMemo, useState, useEffect } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useKhandaSalesList } from '@/pages/mill-admin/sales-reports/khanda-sales/data/hooks'
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
import { useCreateKhandaOutward, useUpdateKhandaOutward } from '../data/hooks'
import { khandaOutwardSchema, type KhandaOutward } from '../data/schema'

const useKhandaSalesListWrapper = (params: any) => {
    return useKhandaSalesList(params.millId, params, {
        enabled: !!params.millId,
    })
}

type KhandaOutwardActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: KhandaOutward | null
    millId: string
}

export function KhandaOutwardActionDialog({
    open,
    onOpenChange,
    currentRow,
    millId,
}: KhandaOutwardActionDialogProps) {
    const { t } = useTranslation('mill-staff')
    const salesDeals = usePaginatedList(
        millId,
        open,
        {
            useListHook: useKhandaSalesListWrapper,
            extractItems: (data) =>
                data.sales
                    ?.map((s) => s.khandaSalesDealNumber)
                    .filter(Boolean) as string[],
            hookParams: { sortBy: 'date', sortOrder: 'desc' },
        },
        currentRow?.khandaSaleDealNumber || undefined
    )

    const { data: salesList } = useKhandaSalesList(
        millId,
        { limit: 1000 },
        { enabled: open }
    )

    const handleDealSelect = (dealNumber: string) => {
        form.setValue('khandaSaleDealNumber', dealNumber)
        const selectedDeal = salesList?.sales?.find(
            (sale) => sale.khandaSalesDealNumber === dealNumber
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

    const createMutation = useCreateKhandaOutward(millId)
    const updateMutation = useUpdateKhandaOutward(millId)

    const defaultValues = useMemo(
        () => ({
            date: format(new Date(), 'yyyy-MM-dd'),
            khandaSaleDealNumber: '',
            partyName: '',
            brokerName: '',
            gunnyPlastic: undefined,
            plasticGunnyWeight: undefined,
            truckNo: '',
            truckRst: '',
            truckWeight: undefined,
            gunnyWeight: undefined,
            netWeight: undefined,
        }),
        []
    )

    const form = useForm<KhandaOutward>({
        resolver: zodResolver(khandaOutwardSchema),
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

    const onSubmit = (data: KhandaOutward) => {
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
                    loading: 'Updating...',
                    success: () => {
                        onOpenChange(false)
                        return 'Updated successfully'
                    },
                    error: 'Failed to update',
                }
            )
        } else {
            toast.promise(createMutation.mutateAsync(submissionData), {
                loading: 'Adding...',
                success: () => {
                    onOpenChange(false)
                    return 'Added successfully'
                },
                error: 'Failed to add',
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t('outward.khandaOutward.form.title', {
                                  context: 'edit',
                              })
                            : t('outward.khandaOutward.form.title', {
                                  context: 'add',
                              })}
                    </DialogTitle>
                    <DialogDescription>
                        {t('outward.khandaOutward.form.description')}
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
                                                'outward.khandaOutward.form.fields.date'
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
                                name='khandaSaleDealNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.khandaOutward.form.fields.khandaSaleDealNumber'
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
                                                    'outward.khandaOutward.form.fields.khandaSaleDealNumber.emptyText'
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
                                            {t(
                                                'outward.khandaOutward.form.fields.partyName'
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
                                                'outward.khandaOutward.form.fields.brokerName'
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
                                name='gunnyPlastic'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.khandaOutward.form.fields.gunnyPlastic'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'common.enterValue'
                                                )}
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
                                                'outward.khandaOutward.form.fields.plasticGunnyWeight'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'common.enterValue'
                                                )}
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
                                                'outward.khandaOutward.form.fields.truckNo'
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
                                                'outward.khandaOutward.form.fields.truckRst'
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
                                                'outward.khandaOutward.form.fields.truckWeight'
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
                                                'outward.khandaOutward.form.fields.gunnyWeight'
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
                                                'outward.khandaOutward.form.fields.netWeight'
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
