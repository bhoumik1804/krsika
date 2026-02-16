import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBrokerList } from '@/pages/mill-admin/input-reports/broker-report/data/hooks'
import { usePartyList } from '@/pages/mill-admin/input-reports/party-report/data/hooks'
import { CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import {
    riceTypeOptions,
    deliveryTypeOptions,
    fciOrNANOptions,
    frkTypeOptions,
    gunnyTypeOptions,
    saleLotOrOtherOptions,
} from '@/constants/sale-form'
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
import { useCreateRiceSales, useUpdateRiceSales } from '../data/hooks'
import { riceSalesSchema, type RiceSales } from '../data/schema'

type RiceSalesActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: RiceSales | null
}

export function RiceSalesActionDialog({
    open,
    onOpenChange,
    currentRow,
}: RiceSalesActionDialogProps) {
    const { t } = useTranslation('mill-staff')
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
    const { mutateAsync: createRiceSales, isPending: isCreating } =
        useCreateRiceSales(millId || '')
    const { mutateAsync: updateRiceSales, isPending: isUpdating } =
        useUpdateRiceSales(millId || '')

    const isEditing = !!currentRow
    const isLoading = isCreating || isUpdating
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const form = useForm<RiceSales>({
        resolver: zodResolver(riceSalesSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            partyName: '',
            brokerName: '',
            deliveryType: '',
            lotOrOther: '',
            fciOrNAN: '',
            riceType: '',
            riceQty: undefined,
            riceRatePerQuintal: undefined,
            discountPercent: undefined,
            brokeragePerQuintal: undefined,
            gunnyType: '',
            newGunnyRate: undefined,
            oldGunnyRate: undefined,
            plasticGunnyRate: undefined,
            frkType: '',
            frkRatePerQuintal: undefined,
            lotNumber: '',
        } as RiceSales,
    })

    // Watchers for conditional rendering
    const watchLotOrOther = form.watch('lotOrOther')
    const watchGunnyType = form.watch('gunnyType')
    const watchFrkType = form.watch('frkType')

    // LOT Sale is the first option ("LOT बिक्री")
    const isLotSale = watchLotOrOther === saleLotOrOtherOptions[0]?.value

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
                    riceRatePerQuintal: undefined,
                    discountPercent: undefined,
                    brokeragePerQuintal: undefined,
                    gunnyType: '',
                    newGunnyRate: undefined,
                    oldGunnyRate: undefined,
                    plasticGunnyRate: undefined,
                    frkType: '',
                    frkRatePerQuintal: undefined,
                    lotNumber: '',
                })
            }
        }
    }, [currentRow, open, form])

    const onSubmit = async (data: RiceSales) => {
        try {
            const submissionData = {
                ...data,
                partyName: data.partyName || undefined,
                brokerName: data.brokerName || undefined,
            }

            if (isEditing && currentRow?._id) {
                await updateRiceSales({
                    _id: currentRow._id,
                    ...submissionData,
                })
            } else {
                await createRiceSales(submissionData)
            }
            onOpenChange(false)
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    // Option mapping helpers
    const deliveryTypeMap: Record<string, string> = {
        'पड़े में': 'pede',
        'पहुंचा कर': 'delivered',
    }

    const lotOrOtherMap: Record<string, string> = {
        'LOT बिक्री': 'lot',
        'अन्य बिक्री': 'other',
    }

    const fciOrNANMap: Record<string, string> = {
        FCI: 'fci',
        NAN: 'nan',
    }

    const frkTypeMap: Record<string, string> = {
        'FRK साहित': 'sahit',
        'FRK देना है': 'dena',
        'NON FRK': 'non',
    }

    const riceTypeMap: Record<string, string> = {
        'चावल(मोटा)': 'mota',
        'चावल(पतला)': 'patla',
    }

    const gunnyTypeMap: Record<string, string> = {
        'सहित (वजन में)': 'vajanWeight',
        'सहित (भाव में)': 'bhavRate',
        वापसी: 'vapsiReturn',
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t('riceSales.form.editTitle')
                            : t('riceSales.form.addTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t('riceSales.form.editDescription')
                            : t('riceSales.form.addDescription')}
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
                                                {t('riceSales.form.date')}
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
                                                                      'riceSales.form.placeholders.date'
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
                                                {t('riceSales.form.partyName')}
                                            </FormLabel>
                                            <FormControl>
                                                <PaginatedCombobox
                                                    value={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    paginatedList={party}
                                                    placeholder={t(
                                                        'riceSales.form.placeholders.party'
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
                                                {t('riceSales.form.brokerName')}
                                            </FormLabel>
                                            <FormControl>
                                                <PaginatedCombobox
                                                    value={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    paginatedList={broker}
                                                    placeholder={t(
                                                        'riceSales.form.placeholders.broker'
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
                                                    'riceSales.form.deliveryType'
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
                                                                'riceSales.form.placeholders.select'
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
                                                                    `riceSales.options.deliveryType.${deliveryTypeMap[option.value]}`
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
                                                {t('riceSales.form.lotOrOther')}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue
                                                            placeholder={t(
                                                                'riceSales.form.placeholders.select'
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className='w-full'>
                                                    {saleLotOrOtherOptions.map(
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
                                                                    `riceSales.options.lotOrOther.${lotOrOtherMap[option.value]}`
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

                                {isLotSale && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name='fciOrNAN'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {t(
                                                            'riceSales.form.fciOrNAN'
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
                                                                        'riceSales.form.placeholders.select'
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
                                                                            `riceSales.options.fciOrNAN.${fciOrNANMap[option.value]}`
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
                                                            'riceSales.form.lotNumber'
                                                        )}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder={t(
                                                                'riceSales.form.placeholders.lotNumber'
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
                                                            'riceSales.form.frkType'
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
                                                                        'riceSales.form.placeholders.select'
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
                                                                            `riceSales.options.frkType.${frkTypeMap[option.value]}`
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
                                                                'riceSales.form.frkRatePerQuintal'
                                                            )}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type='number'
                                                                step='0.01'
                                                                placeholder='0.00'
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
                                                {t('riceSales.form.riceType')}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue
                                                            placeholder={t(
                                                                'riceSales.form.placeholders.select'
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
                                                                    `riceSales.options.riceType.${riceTypeMap[option.value]}`
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
                                    name='riceQty'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t('riceSales.form.riceQty')}
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
                                    name='riceRatePerQuintal'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'riceSales.form.riceRatePerQuintal'
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
                                    name='discountPercent'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'riceSales.form.discountPercent'
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
                                                    'riceSales.form.brokeragePerQuintal'
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
                                    name='gunnyType'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t('riceSales.form.gunnyType')}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue
                                                            placeholder={t(
                                                                'riceSales.form.placeholders.select'
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
                                                                    `riceSales.options.gunnyType.${gunnyTypeMap[option.value]}`
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
                                                            'riceSales.form.newGunnyRate'
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
                                                            'riceSales.form.oldGunnyRate'
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
                                                            'riceSales.form.plasticGunnyRate'
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
                                {t('riceSales.form.buttons.cancel')}
                            </Button>
                            <Button type='submit' disabled={isLoading}>
                                {isLoading
                                    ? isEditing
                                        ? t('riceSales.form.buttons.updating')
                                        : t('riceSales.form.buttons.adding')
                                    : isEditing
                                      ? t('riceSales.form.buttons.update')
                                      : t('riceSales.form.buttons.add')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
