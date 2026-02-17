import { useEffect, useState, useMemo, useRef } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGunnyPurchaseList } from '@/pages/mill-admin/purchase-reports/gunny/data/hooks'
import type { GunnyPurchaseResponse } from '@/pages/mill-admin/purchase-reports/gunny/data/types'
import { CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { gunnyDeliveryTypeOptions } from '@/constants/purchase-form'
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
import { useCreateGunnyInward, useUpdateGunnyInward } from '../data/hooks'
import { gunnyInwardSchema, type GunnyInwardSchema } from '../data/schema'
import { gunnyInward } from './gunny-inward-provider'

const useGunnyPurchaseListCompat = (params: any) => {
    return useGunnyPurchaseList(params)
}

type GunnyInwardActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function GunnyInwardActionDialog({
    open,
    onOpenChange,
}: GunnyInwardActionDialogProps) {
    const { millId, currentRow } = gunnyInward()
    const { t } = useTranslation('mill-staff')
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const { mutate: createInward, isPending: isCreating } =
        useCreateGunnyInward(millId)
    const { mutate: updateInward, isPending: isUpdating } =
        useUpdateGunnyInward(millId)

    const purchaseDataRef = useRef<GunnyPurchaseResponse[]>([])

    const gunnyDeal = usePaginatedList(
        millId,
        open,
        {
            useListHook: useGunnyPurchaseListCompat,
            extractItems: (data: any) => {
                purchaseDataRef.current = data.purchases || []
                return data.purchases
                    .map(
                        (p: GunnyPurchaseResponse) => p.gunnyPurchaseDealNumber
                    )
                    .filter(Boolean) as string[]
            },
            hookParams: { sortBy: 'date', sortOrder: 'desc' },
        },
        currentRow?.gunnyPurchaseDealNumber || undefined
    )

    const isLoading = isCreating || isUpdating
    const isEditing = !!currentRow

    const getDefaultValues = useMemo(() => {
        if (currentRow) {
            return {
                date: currentRow.date,
                gunnyPurchaseDealId: currentRow.gunnyPurchaseDealId,
                partyName: currentRow.partyName,
                delivery: currentRow.delivery,
                samitiSangrahan: currentRow.samitiSangrahan,
                gunnyNew: currentRow.gunnyNew,
                gunnyOld: currentRow.gunnyOld,
                gunnyPlastic: currentRow.gunnyPlastic,
                gunnyPurchaseDealNumber: currentRow.gunnyPurchaseDealNumber,
            }
        }
        return {
            date: format(new Date(), 'yyyy-MM-dd'),
            gunnyPurchaseDealId: '',
            partyName: '',
            delivery: '',
            samitiSangrahan: '',
            gunnyNew: 0,
            gunnyOld: 0,
            gunnyPlastic: 0,
            gunnyPurchaseDealNumber: '',
        }
    }, [currentRow])

    const form = useForm<GunnyInwardSchema>({
        resolver: zodResolver(gunnyInwardSchema),
        defaultValues: getDefaultValues,
    })

    useEffect(() => {
        if (open) {
            form.reset(getDefaultValues)
        }
    }, [currentRow, open, getDefaultValues, form])

    const handleDealSelect = (dealId: string) => {
        form.setValue('gunnyPurchaseDealNumber', dealId)
        const purchase = purchaseDataRef.current.find(
            (p) => p.gunnyPurchaseDealNumber === dealId
        )
        if (purchase) {
            if (purchase.partyName)
                form.setValue('partyName', purchase.partyName)
            if (purchase.deliveryType)
                form.setValue('delivery', purchase.deliveryType)

            // Map quantities correctly, checking for undefined/null to allow 0
            if (
                purchase.newGunnyQty !== undefined &&
                purchase.newGunnyQty !== null
            )
                form.setValue('gunnyNew', purchase.newGunnyQty)
            if (
                purchase.oldGunnyQty !== undefined &&
                purchase.oldGunnyQty !== null
            )
                form.setValue('gunnyOld', purchase.oldGunnyQty)
            if (
                purchase.plasticGunnyQty !== undefined &&
                purchase.plasticGunnyQty !== null
            )
                form.setValue('gunnyPlastic', purchase.plasticGunnyQty)

            if (purchase._id) {
                form.setValue('gunnyPurchaseDealId', purchase._id)
            }
        }
    }

    const onSubmit = (data: GunnyInwardSchema) => {
        const { _id, ...rest } = data
        const submissionData = {
            ...rest,
            partyName: rest.partyName || undefined,
            gunnyPurchaseDealNumber: rest.gunnyPurchaseDealNumber || undefined,
            delivery: rest.delivery || undefined,
            samitiSangrahan: rest.samitiSangrahan || undefined,
        }

        if (isEditing && currentRow?._id) {
            updateInward(
                {
                    id: currentRow._id,
                    data: { ...submissionData, _id: currentRow._id },
                },
                {
                    onSuccess: () => {
                        onOpenChange(false)
                        form.reset()
                        toast.success(t('common.toast.updateSuccess')) // Localized toast message
                    },
                    onError: () => {
                        toast.error(t('common.toast.updateError')) // Localized toast message
                    },
                }
            )
        } else {
            createInward(submissionData, {
                onSuccess: () => {
                    onOpenChange(false)
                    form.reset()
                    toast.success(t('common.toast.createSuccess')) // Localized toast message
                },
                onError: () => {
                    toast.error(t('common.toast.createError')) // Localized toast message
                },
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t('gunnyInward.editRecord') // Original content
                            : t('gunnyInward.addRecord')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? t('common.update') : t('common.enter')}{' '}
                        {t('common.detailsBelow')}
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
                                            {t('gunnyInward.form.date')}
                                        </FormLabel>
                                        <Popover
                                            open={datePopoverOpen}
                                            onOpenChange={setDatePopoverOpen}
                                        >
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        id='date'
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
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='gunnyPurchaseDealNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'gunnyInward.form.gunnyPurchaseDealNumber'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <PaginatedCombobox
                                                value={field.value || ''}
                                                onValueChange={handleDealSelect}
                                                paginatedList={gunnyDeal}
                                                placeholder={t(
                                                    'gunnyInward.form.searchDeal'
                                                )}
                                                emptyText={t(
                                                    'gunnyInward.form.noDealsFound'
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
                                            {t('gunnyInward.form.partyName')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value || ''}
                                                placeholder={t(
                                                    'gunnyInward.form.enterPartyName'
                                                )}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='delivery'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('gunnyInward.form.delivery')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value || ''}
                                                placeholder={t(
                                                    'gunnyInward.form.enterDelivery'
                                                )}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {form.watch('delivery') ===
                                gunnyDeliveryTypeOptions[1].value && (
                                <FormField
                                    control={form.control}
                                    name='samitiSangrahan'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'gunnyInward.form.samitiSangrahan'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value || ''}
                                                    placeholder={t(
                                                        'gunnyInward.form.enterSamitiSangrahan'
                                                    )}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={form.control}
                                name='gunnyNew'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('gunnyInward.form.gunnyNew')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value)
                                                    )
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
                                            {t('gunnyInward.form.gunnyOld')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value)
                                                    )
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
                                            {t('gunnyInward.form.gunnyPlastic')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value)
                                                    )
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
