import { useEffect, useState } from 'react'
import { useRef } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGunnySalesList } from '@/pages/mill-admin/sales-reports/gunny-sales/data/hooks'
import { GunnySalesResponse } from '@/pages/mill-admin/sales-reports/gunny-sales/data/types'
import { CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
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
    useCreatePrivateGunnyOutward,
    useUpdatePrivateGunnyOutward,
} from '../data/hooks'
import {
    PrivateGunnyOutwardSchema,
    type PrivateGunnyOutward,
} from '../data/schema'

type PrivateGunnyOutwardActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PrivateGunnyOutward | null
}

export function PrivateGunnyOutwardActionDialog({
    open,
    onOpenChange,
    currentRow,
}: PrivateGunnyOutwardActionDialogProps) {
    const { millId } = useParams<{ millId: string }>()
    const { t } = useTranslation('mill-staff')
    const gunnySaleDataRef = useRef<GunnySalesResponse[]>([])

    const useGunnySalesListCompat = (params: any) => {
        return useGunnySalesList(
            millId || '',
            { ...params, pageSize: params.limit },
            { enabled: open }
        )
    }

    const gunnySaleDeal = usePaginatedList(
        millId || '',
        open,
        {
            useListHook: useGunnySalesListCompat,
            extractItems: (data: any) => {
                gunnySaleDataRef.current = data.sales || []
                return data.sales
                    .map((p: GunnySalesResponse) => p.gunnySalesDealNumber)
                    .filter(Boolean) as string[]
            },
            hookParams: { sortBy: 'date', sortOrder: 'desc' },
        },
        currentRow?.gunnySaleDealNumber || undefined
    )

    const handleDealSelect = (dealId: string) => {
        form.setValue('gunnySaleDealNumber', dealId)
        const sale = gunnySaleDataRef.current.find(
            (p) => p.gunnySalesDealNumber === dealId
        )
        if (sale) {
            if (sale.partyName) form.setValue('partyName', sale.partyName)
            if (sale.newGunnyQty) form.setValue('newGunnyQty', sale.newGunnyQty)
            if (sale.oldGunnyQty) form.setValue('oldGunnyQty', sale.oldGunnyQty)
            if (sale.plasticGunnyQty)
                form.setValue('plasticGunnyQty', sale.plasticGunnyQty)
        }
    }
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const createMutation = useCreatePrivateGunnyOutward(millId || '')
    const updateMutation = useUpdatePrivateGunnyOutward(millId || '')

    const form = useForm<PrivateGunnyOutward>({
        resolver: zodResolver(PrivateGunnyOutwardSchema),
        defaultValues: {
            _id: '',
            date: '',
            gunnySaleDealNumber: '',
            partyName: '',
            newGunnyQty: undefined,
            oldGunnyQty: undefined,
            plasticGunnyQty: undefined,
            truckNo: '',
        },
    })

    useEffect(() => {
        if (open) {
            if (currentRow) {
                form.reset(currentRow)
            } else {
                form.reset({
                    _id: '',
                    date: format(new Date(), 'yyyy-MM-dd'),
                    gunnySaleDealNumber: '',
                    partyName: '',
                    newGunnyQty: undefined,
                    oldGunnyQty: undefined,
                    plasticGunnyQty: undefined,
                    truckNo: '',
                })
            }
        }
    }, [currentRow, form, open])

    const onSubmit = async (data: PrivateGunnyOutward) => {
        try {
            const submissionData = {
                ...data,
                partyName: data.partyName || undefined,
            }

            if (isEditing && currentRow?._id) {
                // Exclude _id from update payload (sent as separate id param)
                const { _id, ...updatePayload } = submissionData
                await updateMutation.mutateAsync({
                    id: currentRow._id,
                    payload: updatePayload,
                })
            } else {
                // Exclude _id when creating new entry
                const { _id, ...createPayload } = submissionData
                await createMutation.mutateAsync(createPayload)
            }
            onOpenChange(false)
        } catch (error) {
            // Error handling is done in the mutation hooks
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-xl'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t('outward.privateGunnyOutward.form.title', {
                                  context: 'edit',
                              })
                            : t('outward.privateGunnyOutward.form.title', {
                                  context: 'add',
                              })}
                    </DialogTitle>
                    <DialogDescription>
                        {t('outward.privateGunnyOutward.form.description')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <div className='grid grid-cols-2 gap-4'>
                            {/* Date */}
                            <FormField
                                control={form.control}
                                name='date'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.privateGunnyOutward.form.fields.date'
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
                                                            : 'Select Date'}
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

                            {/* Gunny Sale Deal Number */}
                            <FormField
                                control={form.control}
                                name='gunnySaleDealNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.privateGunnyOutward.form.fields.gunnySaleDealNumber'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <PaginatedCombobox
                                                value={field.value || ''}
                                                onValueChange={handleDealSelect}
                                                paginatedList={gunnySaleDeal}
                                                placeholder='Select gunny sale deal'
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
                                            {t(
                                                'outward.privateGunnyOutward.form.fields.partyName'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter party name'
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* New Gunny Qty */}
                            <FormField
                                control={form.control}
                                name='newGunnyQty'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.privateGunnyOutward.form.fields.newGunnyQty'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter quantity'
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

                            {/* Old Gunny Qty */}
                            <FormField
                                control={form.control}
                                name='oldGunnyQty'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.privateGunnyOutward.form.fields.oldGunnyQty'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter quantity'
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

                            {/* Plastic Gunny Qty */}
                            <FormField
                                control={form.control}
                                name='plasticGunnyQty'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.privateGunnyOutward.form.fields.plasticGunnyQty'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter quantity'
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
                            {/* Truck No */}
                            <FormField
                                control={form.control}
                                name='truckNo'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.privateGunnyOutward.form.fields.truckNo'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter truck number'
                                                {...field}
                                                value={field.value || ''}
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
                                disabled={
                                    createMutation.isPending ||
                                    updateMutation.isPending
                                }
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                type='submit'
                                disabled={
                                    createMutation.isPending ||
                                    updateMutation.isPending
                                }
                            >
                                {createMutation.isPending ||
                                updateMutation.isPending
                                    ? t('common.saving')
                                    : isEditing
                                      ? t('common.update')
                                      : t(
                                            'outward.privateGunnyOutward.form.primaryButton'
                                        )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
