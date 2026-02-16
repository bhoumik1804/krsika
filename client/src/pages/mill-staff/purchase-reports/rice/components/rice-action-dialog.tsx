import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBrokerList } from '@/pages/mill-admin/input-reports/broker-report/data/hooks'
import { usePartyList } from '@/pages/mill-admin/input-reports/party-report/data/hooks'
import { CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
    riceTypeOptions,
    deliveryTypeOptions,
    fciOrNANOptions,
    lotOrOtherTypeOptions,
    frkTypeOptions,
    gunnyTypeOptions,
} from '@/constants/purchase-form'
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
import { useCreateRicePurchase, useUpdateRicePurchase } from '../data/hooks'
import { ricePurchaseSchema, type RicePurchaseData } from '../data/schema'
import { useRice } from './rice-provider'

type RiceActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: RicePurchaseData | null
}

export function RiceActionDialog({
    open,
    onOpenChange,
    currentRow,
}: RiceActionDialogProps) {
    const { t } = useTranslation('millStaff')
    const { millId } = useRice()
    const { mutateAsync: createRicePurchase, isPending: isCreating } =
        useCreateRicePurchase(millId)
    const { mutateAsync: updateRicePurchase, isPending: isUpdating } =
        useUpdateRicePurchase(millId)

    const isEditing = !!currentRow
    const isLoading = isCreating || isUpdating
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

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

    const form = useForm<RicePurchaseData>({
        resolver: zodResolver(ricePurchaseSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            partyName: '',
            brokerName: '',
            deliveryType: '',
            lotOrOther: '',
            fciOrNAN: '',
            riceType: '',
            riceQty: undefined,
            riceRate: undefined,
            discountPercent: undefined,
            brokeragePerQuintal: undefined,
            gunnyType: '',
            newGunnyRate: undefined,
            oldGunnyRate: undefined,
            plasticGunnyRate: undefined,
            frkType: '',
            frkRatePerQuintal: undefined,
            lotNumber: '',
        } as RicePurchaseData,
    })

    // Watchers for conditional rendering
    const watchPurchaseType = form.watch('lotOrOther')
    const watchGunnyType = form.watch('gunnyType')
    const watchFrkType = form.watch('frkType')

    // LOT Purchase is the first option ("LOT खरीदी")
    const isLotPurchase = watchPurchaseType === lotOrOtherTypeOptions[0]?.value

    // Show gunny rates if "साहित (भाव में)" is selected (Index 1)
    const isGunnySahit = watchGunnyType === gunnyTypeOptions[1]?.value

    // Show FRK Rate if "FRK साहित" is selected (Index 0)
    const isFrkSahit = watchFrkType === frkTypeOptions[0]?.value

    useEffect(() => {
        if (open) {
            if (currentRow) {
                form.reset(currentRow)
            } else {
                form.reset({
                    date: format(new Date(), 'yyyy-MM-dd'),
                    partyName: '',
                    brokerName: '',
                    deliveryType: '',
                    lotOrOther: '',
                    fciOrNAN: '',
                    riceType: '',
                    riceQty: undefined,
                    riceRate: undefined,
                    discountPercent: undefined,
                    brokeragePerQuintal: undefined,
                    gunnyType: '',
                    newGunnyRate: undefined,
                    oldGunnyRate: undefined,
                    plasticGunnyRate: undefined,
                    frkType: '',
                    frkRatePerQuintal: undefined,
                    lotNumber: '',
                } as RicePurchaseData)
            }
        }
    }, [currentRow, open, form])

    const onSubmit = async (data: RicePurchaseData) => {
        try {
            if (isEditing && currentRow?._id) {
                await updateRicePurchase({
                    purchaseId: currentRow._id,
                    data,
                })
            } else {
                await createRicePurchase(data)
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
                            ? t('ricePurchase.form.editTitle')
                            : t('ricePurchase.form.addTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t('ricePurchase.form.editDescription')
                            : t('ricePurchase.form.addDescription')}
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
                                                {t('ricePurchase.form.date')}
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
                                                                      'ricePurchase.form.placeholders.select'
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
                                                    'ricePurchase.form.partyName'
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
                                                        'ricePurchase.form.placeholders.party'
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
                                                    'ricePurchase.form.brokerName'
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
                                                        'ricePurchase.form.placeholders.broker'
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
                                    name='deliveryType'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'ricePurchase.form.delivery'
                                                )}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue
                                                            placeholder={t(
                                                                'ricePurchase.form.placeholders.select'
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className='w-full'>
                                                    {deliveryTypeOptions.map(
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
                                                                    `ricePurchase.options.delivery.${option.value === 'पड़े में' ? 'pade' : 'pahunch'}`
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
                                    name='lotOrOther'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'ricePurchase.form.purchaseType'
                                                )}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue
                                                            placeholder={t(
                                                                'ricePurchase.form.placeholders.select'
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className='w-full'>
                                                    {lotOrOtherTypeOptions.map(
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
                                                                    `ricePurchase.options.purchase.${option.value === 'LOT खरीदी' ? 'lot' : 'other'}`
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

                                {/* LOT Purchase Fields */}
                                {isLotPurchase && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name='fciOrNAN'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {t(
                                                            'ricePurchase.form.fciOrNAN'
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue
                                                                    placeholder={t(
                                                                        'ricePurchase.form.placeholders.select'
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className='w-full'>
                                                            {fciOrNANOptions.map(
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
                                                                            `ricePurchase.options.fciOrNAN.${option.value.toLowerCase()}`
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
                                            name='lotNumber'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {t(
                                                            'ricePurchase.form.lotNumber'
                                                        )}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder={t(
                                                                'ricePurchase.form.placeholders.lotNumber'
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
                                            name='frkType'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {t(
                                                            'ricePurchase.form.frkType'
                                                        )}
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue
                                                                    placeholder={t(
                                                                        'ricePurchase.form.placeholders.select'
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className='w-full'>
                                                            {frkTypeOptions.map(
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
                                                                            `ricePurchase.options.frk.${option.value === 'FRK साहित' ? 'sahit' : option.value === 'FRK देना है' ? 'denaHai' : 'nonFrk'}`
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
                                        {isFrkSahit && (
                                            <FormField
                                                control={form.control}
                                                name='frkRatePerQuintal'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            {t(
                                                                'ricePurchase.form.frkRate'
                                                            )}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type='number'
                                                                step='0.01'
                                                                placeholder={t(
                                                                    'ricePurchase.form.placeholders.amount'
                                                                )}
                                                                {...field}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const val =
                                                                        e.target
                                                                            .valueAsNumber
                                                                    field.onChange(
                                                                        isNaN(
                                                                            val
                                                                        )
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
                                    </>
                                )}

                                <FormField
                                    control={form.control}
                                    name='riceType'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t('ricePurchase.form.type')}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue
                                                            placeholder={t(
                                                                'ricePurchase.form.placeholders.select'
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className='w-full'>
                                                    {riceTypeOptions.map(
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
                                                                    `ricePurchase.options.riceType.${option.value === 'चावल(मोटा)' ? 'mota' : 'patla'}`
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

                                {/* Common Fields */}
                                <FormField
                                    control={form.control}
                                    name='riceQty'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'ricePurchase.form.quantity'
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
                                <FormField
                                    control={form.control}
                                    name='riceRate'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t('ricePurchase.form.rate')}
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
                                <FormField
                                    control={form.control}
                                    name='discountPercent'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'ricePurchase.form.discount'
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
                                <FormField
                                    control={form.control}
                                    name='brokeragePerQuintal'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'ricePurchase.form.brokerage'
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

                                {/* Gunny Options */}
                                <FormField
                                    control={form.control}
                                    name='gunnyType'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t('ricePurchase.form.gunny')}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue
                                                            placeholder={t(
                                                                'ricePurchase.form.placeholders.select'
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className='w-full'>
                                                    {gunnyTypeOptions.map(
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
                                                                    `ricePurchase.options.gunny.${option.value === 'सहित (वजन में)' ? 'sahitVajan' : option.value === 'सहित (भाव में)' ? 'sahitBhav' : 'vapsi'}`
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

                                {isGunnySahit && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name='newGunnyRate'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {t(
                                                            'ricePurchase.form.newGunnyRate'
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
                                        <FormField
                                            control={form.control}
                                            name='oldGunnyRate'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {t(
                                                            'ricePurchase.form.oldGunnyRate'
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
                                        <FormField
                                            control={form.control}
                                            name='plasticGunnyRate'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {t(
                                                            'ricePurchase.form.plasticGunnyRate'
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
                                    </>
                                )}
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
                                      ? t('ricePurchase.form.editTitle')
                                      : t('ricePurchase.form.addTitle')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
