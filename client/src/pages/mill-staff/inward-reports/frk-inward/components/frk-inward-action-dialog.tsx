import { useEffect, useState, useRef } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFrkPurchaseList } from '@/pages/mill-admin/purchase-reports/frk/data/hooks'
import type { FrkPurchaseData } from '@/pages/mill-admin/purchase-reports/frk/data/schema'
import { CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
import { useCreateFrkInward, useUpdateFrkInward } from '../data/hooks'
import { frkInwardSchema, type FrkInward } from '../data/schema'
import { useFrkInward } from './frk-inward-provider'

type FrkInwardActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: FrkInward | null
}

export function FrkInwardActionDialog({
    open,
    onOpenChange,
    currentRow,
}: FrkInwardActionDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { millId } = useFrkInward()
    const isEditing = !!currentRow
    const { mutateAsync: createFrkInward, isPending: isCreating } =
        useCreateFrkInward(millId)
    const { mutateAsync: updateFrkInward, isPending: isUpdating } =
        useUpdateFrkInward(millId)

    const purchaseDataRef = useRef<FrkPurchaseData[]>([])

    const useFrkPurchaseListCompat = (params: any) => {
        return useFrkPurchaseList({ ...params, pageSize: params.limit })
    }

    const frkPurchaseDeal = usePaginatedList(
        millId,
        open,
        {
            useListHook: useFrkPurchaseListCompat,
            extractItems: (data: any) => {
                purchaseDataRef.current = data.data || []
                return data.data
                    .map((p: FrkPurchaseData) => p.frkPurchaseDealNumber)
                    .filter(Boolean) as string[]
            },
            hookParams: { sortBy: 'date', sortOrder: 'desc' },
        },
        currentRow?.frkPurchaseDealNumber || undefined
    )

    const handleDealSelect = (dealId: string) => {
        form.setValue('frkPurchaseDealNumber', dealId)
        const purchase = purchaseDataRef.current.find(
            (p) => p.frkPurchaseDealNumber === dealId
        )
        if (purchase) {
            if (purchase.partyName)
                form.setValue('partyName', purchase.partyName)
        }
    }
    const isLoading = isCreating || isUpdating
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const getDefaultValues = () => ({
        date: format(new Date(), 'yyyy-MM-dd'),
        frkPurchaseDealNumber: '',
        partyName: '',
        gunnyPlastic: undefined,
        plasticWeight: undefined,
        truckNumber: '',
        rstNumber: '',
        truckWeight: undefined,
        gunnyWeight: undefined,
        netWeight: undefined,
    })

    const form = useForm<FrkInward>({
        resolver: zodResolver(frkInwardSchema),
        defaultValues: getDefaultValues(),
    })

    useEffect(() => {
        if (open) {
            if (currentRow) {
                form.reset(currentRow)
            } else {
                form.reset(getDefaultValues())
            }
        }
    }, [currentRow, open, form])

    const onSubmit = async (data: FrkInward) => {
        try {
            const { _id, ...rest } = data
            const payload = {
                ...rest,
                partyName: rest.partyName || undefined,
            }
            if (isEditing && currentRow?._id) {
                await updateFrkInward({
                    id: currentRow._id,
                    data: payload,
                })
            } else {
                await createFrkInward(payload)
            }
            onOpenChange(false)
            form.reset(getDefaultValues())
        } catch (error) {
            console.error('FRK inward form submission error:', error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t('frkInward.editRecord')
                            : t('frkInward.addRecord')}
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
                                            {t('frkInward.form.date')}
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
                                name='frkPurchaseDealNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'frkInward.form.frkPurchaseDealNumber'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <PaginatedCombobox
                                                value={field.value || ''}
                                                onValueChange={handleDealSelect}
                                                paginatedList={frkPurchaseDeal}
                                                placeholder={t(
                                                    'frkInward.form.searchDeal'
                                                )}
                                                emptyText={t(
                                                    'frkInward.form.noDealsFound'
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
                                            {t('frkInward.form.partyName')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'frkInward.form.enterPartyName'
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
                                            {t('frkInward.form.gunnyPlastic')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
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
                                name='plasticWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('frkInward.form.plasticWeight')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
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
                                name='truckNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('frkInward.form.truckNumber')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'frkInward.form.enterTruckNumber'
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
                                name='rstNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('frkInward.form.rstNumber')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'frkInward.form.enterRstNumber'
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
                                            {t('frkInward.form.truckWeight')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
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
                                name='gunnyWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('frkInward.form.gunnyWeight')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
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
                                name='netWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('frkInward.form.netWeight')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
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
