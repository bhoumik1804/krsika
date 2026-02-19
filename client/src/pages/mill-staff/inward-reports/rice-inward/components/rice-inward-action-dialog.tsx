import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRicePurchaseList } from '@/pages/mill-admin/purchase-reports/rice/data/hooks'
import type { RicePurchaseResponse } from '@/pages/mill-admin/purchase-reports/rice/data/types'
import { CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
    riceTypeOptions,
    ricePurchaseTypeOptions,
    gunnyTypeOptions,
    frkTypeOptions,
} from '@/constants/purchase-form'
import { usePaginatedList } from '@/hooks/use-paginated-list'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { useCreateRiceInward, useUpdateRiceInward } from '../data/hooks'
import { riceInwardSchema, type RiceInward } from '../data/schema'
import { riceInward } from './rice-inward-provider'

// Wrapper to adapt useRicePurchaseList params for usePaginatedList
const useRicePurchaseListCompat = (params: any) => {
    return useRicePurchaseList({
        ...params,
        pageSize: params.limit,
    })
}

type RiceInwardActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: RiceInward | null
}

export function RiceInwardActionDialog({
    open,
    onOpenChange,
    currentRow,
}: RiceInwardActionDialogProps) {
    const { millId } = riceInward()
    const { t } = useTranslation('mill-staff')
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    // Store raw purchase data for auto-fill lookup
    const purchaseDataRef = useMemo(
        () => ({ current: [] as RicePurchaseResponse[] }),
        []
    )

    // Paginated rice purchase deal selection
    const riceDeal = usePaginatedList(
        millId,
        open,
        {
            useListHook: useRicePurchaseListCompat,
            extractItems: (data) => {
                const purchases = data.data ?? []
                // Store raw data for auto-fill lookup
                purchaseDataRef.current = [
                    ...purchaseDataRef.current.filter(
                        (p) =>
                            !purchases.some(
                                (np) =>
                                    np.ricePurchaseDealNumber ===
                                    p.ricePurchaseDealNumber
                            )
                    ),
                    ...purchases,
                ]
                // Correctly extract deal numbers
                return purchases
                    .map((p) => p.ricePurchaseDealNumber)
                    .filter(Boolean) as string[]
            },
            hookParams: { sortBy: 'date', sortOrder: 'desc' },
        },
        currentRow?.ricePurchaseDealNumber || undefined
    )

    const createMutation = useCreateRiceInward(millId)
    const updateMutation = useUpdateRiceInward(millId)

    const getDefaultValues = useMemo(
        () => ({
            date: format(new Date(), 'yyyy-MM-dd'),
            ricePurchaseDealNumber: '',
            partyName: '',
            brokerName: '',
            riceType: undefined,
            balanceInward: undefined,
            inwardType: undefined,
            lotNumber: '',
            frkOrNAN: undefined,
            gunnyOption: undefined,
            gunnyNew: undefined,
            gunnyOld: undefined,
            gunnyPlastic: undefined,
            juteWeight: undefined,
            plasticWeight: undefined,
            gunnyWeight: undefined,
            truckNumber: '',
            rstNumber: '',
            truckLoadWeight: undefined,
            riceMotaNetWeight: undefined,
            ricePatlaNetWeight: undefined,
        }),
        []
    )

    const form = useForm<RiceInward>({
        resolver: zodResolver(riceInwardSchema),
        defaultValues: getDefaultValues,
    })

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset(getDefaultValues)
        }
    }, [currentRow, getDefaultValues])

    const handleDealSelect = (dealId: string) => {
        form.setValue('ricePurchaseDealNumber', dealId)
        const purchase = purchaseDataRef.current.find(
            (p) => p.ricePurchaseDealNumber === dealId
        )
        if (purchase) {
            if (purchase.partyName)
                form.setValue('partyName', purchase.partyName)
            if (purchase.brokerName)
                form.setValue('brokerName', purchase.brokerName)
            if (purchase.riceType) form.setValue('riceType', purchase.riceType)
            if (purchase.lotOrOther) {
                if (purchase.lotOrOther === 'LOT खरीदी') {
                    form.setValue('inwardType', 'LOT खरीदी')
                } else if (purchase.lotOrOther === 'अन्य खरीदी') {
                    form.setValue('inwardType', 'चावल खरीदी')
                }
            }
            if (purchase.frkType) form.setValue('frkOrNAN', purchase.frkType)
            if (purchase.gunnyType)
                form.setValue('gunnyOption', purchase.gunnyType)
            if (purchase.lotNumber)
                form.setValue('lotNumber', purchase.lotNumber)
            if (purchase.riceQty)
                form.setValue('balanceInward', purchase.riceQty)
        }
    }

    const onSubmit = (data: RiceInward) => {
        const submissionData = {
            ...data,
            partyName: data.partyName || undefined,
            brokerName: data.brokerName || undefined,
            ricePurchaseDealNumber: data.ricePurchaseDealNumber || undefined,
            riceType: data.riceType || undefined,
            inwardType: data.inwardType || undefined,
            lotNumber: data.lotNumber || undefined,
            frkOrNAN: data.frkOrNAN || undefined,
            gunnyOption: data.gunnyOption || undefined,
            truckNumber: data.truckNumber || undefined,
            rstNumber: data.rstNumber || undefined,
        }

        if (isEditing && currentRow?._id) {
            updateMutation.mutate(
                {
                    id: currentRow._id,
                    data: { ...submissionData, _id: currentRow._id },
                },
                {
                    onSuccess: () => {
                        toast.success('Updated successfully')
                        onOpenChange(false)
                        form.reset(getDefaultValues)
                    },
                    onError: (error) => {
                        toast.error(error.message || 'Failed to update')
                    },
                }
            )
        } else {
            createMutation.mutate(submissionData, {
                onSuccess: () => {
                    toast.success('Added successfully')
                    onOpenChange(false)
                    form.reset(getDefaultValues)
                },
                onError: (error) => {
                    toast.error(error.message || 'Failed to add')
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
                            ? t('common.edit')
                            : t('inward.riceInward.form.title')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t('common.updateDetails')
                            : t('inward.riceInward.form.description')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <div className='grid grid-cols-2 gap-4'>
                            {/* Date, Deal info & Inward Type */}
                            <FormField
                                control={form.control}
                                name='date'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'inward.riceInward.form.fields.date'
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
                                name='ricePurchaseDealNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'inward.riceInward.form.fields.ricePurchaseDealNumber'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <PaginatedCombobox
                                                value={field.value || ''}
                                                onValueChange={handleDealSelect}
                                                paginatedList={riceDeal}
                                                placeholder={t(
                                                    'common.searchObject',
                                                    {
                                                        object: t(
                                                            'inward.riceInward.form.fields.ricePurchaseDealNumber'
                                                        ),
                                                    }
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
                                            {t(
                                                'inward.riceInward.form.fields.partyName'
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
                                                'inward.riceInward.form.fields.brokerName'
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
                                name='inwardType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'inward.riceInward.form.fields.inwardType'
                                            )}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || undefined}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select Type' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='w-full'>
                                                {ricePurchaseTypeOptions.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
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

                            {/* Conditional LOT No */}
                            {form.watch('inwardType') ===
                                ricePurchaseTypeOptions[0].value && (
                                <FormField
                                    control={form.control}
                                    name='lotNumber'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'inward.riceInward.form.fields.lotNumber'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    id='lotNumber'
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
                            )}

                            <FormField
                                control={form.control}
                                name='balanceInward'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'inward.riceInward.form.fields.balanceInward'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id='balanceInward'
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        isNaN(val) ? '' : val
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
                                name='frkOrNAN'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'inward.riceInward.form.fields.frkStatus'
                                            )}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || undefined}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select Status' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='w-full'>
                                                {frkTypeOptions.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
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

                            {/* Gunny Options */}
                            <FormField
                                control={form.control}
                                name='gunnyOption'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'inward.riceInward.form.fields.gunnyOption'
                                            )}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || undefined}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select Option' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='w-full'>
                                                {gunnyTypeOptions.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
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

                            {/* Gunny Details */}
                            <FormField
                                control={form.control}
                                name='gunnyNew'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'inward.riceInward.form.fields.gunnyNew'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id='gunnyNew'
                                                type='number'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        isNaN(val) ? '' : val
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
                                name='gunnyOld'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'inward.riceInward.form.fields.gunnyOld'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id='gunnyOld'
                                                type='number'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        isNaN(val) ? '' : val
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
                                name='gunnyPlastic'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'inward.riceInward.form.fields.gunnyPlastic'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id='gunnyPlastic'
                                                type='number'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        isNaN(val) ? '' : val
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

                            {/* Weights */}
                            <FormField
                                control={form.control}
                                name='juteWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'inward.riceInward.form.fields.juteWeight'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id='juteWeight'
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        isNaN(val) ? '' : val
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
                                            {t(
                                                'inward.riceInward.form.fields.plasticWeight'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id='plasticWeight'
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        isNaN(val) ? '' : val
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
                                            {t(
                                                'inward.riceInward.form.fields.gunnyWeight'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id='gunnyWeight'
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        isNaN(val) ? '' : val
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

                            {/* Truck Details */}
                            <FormField
                                control={form.control}
                                name='truckNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'inward.riceInward.form.fields.truckNumber'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id='truckNumber'
                                                placeholder='XX-00-XX-0000'
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
                                            {t(
                                                'inward.riceInward.form.fields.rstNumber'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id='rstNumber'
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
                                name='truckLoadWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'inward.riceInward.form.fields.truckLoadWeight'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id='truckLoadWeight'
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        isNaN(val) ? '' : val
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

                            {/* Rice Details */}
                            <FormField
                                control={form.control}
                                name='riceType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'inward.riceInward.form.fields.riceType'
                                            )}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || undefined}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select Type' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='w-full'>
                                                {riceTypeOptions.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
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
                            {form.watch('riceType') ===
                                riceTypeOptions[0].value && (
                                <FormField
                                    control={form.control}
                                    name='riceMotaNetWeight'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'inward.riceInward.form.fields.riceMotaNetWeight'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    id='riceMotaNetWeight'
                                                    type='number'
                                                    step='0.01'
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target
                                                                .valueAsNumber
                                                        field.onChange(
                                                            isNaN(val)
                                                                ? ''
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
                            )}
                            {form.watch('riceType') ===
                                riceTypeOptions[1].value && (
                                <FormField
                                    control={form.control}
                                    name='ricePatlaNetWeight'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'inward.riceInward.form.fields.ricePatlaNetWeight'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    id='ricePatlaNetWeight'
                                                    type='number'
                                                    step='0.01'
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target
                                                                .valueAsNumber
                                                        field.onChange(
                                                            isNaN(val)
                                                                ? ''
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
                            )}
                        </div>
                        <div className='flex justify-end gap-2'>
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
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
