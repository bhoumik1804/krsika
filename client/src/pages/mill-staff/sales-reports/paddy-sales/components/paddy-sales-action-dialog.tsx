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
    paddySaleTypeOptions,
    dhanTypeOptions,
    deliveryTypeOptions,
    gunnyTypeOptions,
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
import { useCreatePaddySale, useUpdatePaddySale } from '../data/hooks'
import { paddySalesSchema, type PaddySales } from '../data/schema'

type PaddySalesActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: PaddySales | null
}

export function PaddySalesActionDialog({
    open,
    onOpenChange,
    currentRow,
}: PaddySalesActionDialogProps) {
    const { millId } = useParams<{ millId: string }>()
    const { mutate: createPaddySale, isPending: isCreating } =
        useCreatePaddySale()
    const { mutate: updatePaddySale, isPending: isUpdating } =
        useUpdatePaddySale()

    const { t } = useTranslation('mill-staff')

    const isLoading = isCreating || isUpdating

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

    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const form = useForm<PaddySales>({
        resolver: zodResolver(paddySalesSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            partyName: '',
            brokerName: '',
            saleType: '',
            doNumber: '',
            dhanMotaQty: 0,
            dhanPatlaQty: 0,
            dhanSarnaQty: 0,
            dhanType: '',
            dhanQty: 0,
            paddyRatePerQuintal: 0,
            deliveryType: '',
            discountPercent: 0,
            brokerage: 0,
            gunnyOption: '',
            newGunnyRate: 0,
            oldGunnyRate: 0,
            plasticGunnyRate: 0,
        },
    })

    const watchSaleType = form.watch('saleType')
    const watchGunnyOption = form.watch('gunnyOption')

    const isDOSale = watchSaleType === paddySaleTypeOptions[0]?.value
    const isGunnySahit = watchGunnyOption === gunnyTypeOptions[1]?.value

    useEffect(() => {
        if (open) {
            if (currentRow) {
                form.reset(currentRow)
            } else {
                form.reset({
                    date: format(new Date(), 'yyyy-MM-dd'),
                    partyName: '',
                    brokerName: '',
                    saleType: '',
                    doNumber: '',
                    dhanMotaQty: 0,
                    dhanPatlaQty: 0,
                    dhanSarnaQty: 0,
                    dhanType: '',
                    dhanQty: 0,
                    paddyRatePerQuintal: 0,
                    deliveryType: '',
                    discountPercent: 0,
                    brokerage: 0,
                    gunnyOption: '',
                    newGunnyRate: 0,
                    oldGunnyRate: 0,
                    plasticGunnyRate: 0,
                })
            }
        }
    }, [currentRow, open, form])

    const onSubmit = (data: PaddySales) => {
        console.log('[PaddySales] onSubmit called with:', data)
        if (isEditing && currentRow?._id) {
            updatePaddySale(
                { id: currentRow._id, data },
                {
                    onSuccess: () => {
                        form.reset()
                        onOpenChange(false)
                    },
                }
            )
        } else {
            createPaddySale(data, {
                onSuccess: () => {
                    form.reset()
                    onOpenChange(false)
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
                            ? t('common.edit') +
                              ' ' +
                              t('salesReports.paddy.title')
                            : t('salesReports.paddy.form.title')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t('common.update') +
                              ' ' +
                              t('salesReports.paddy.description')
                            : t('salesReports.paddy.form.description')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit, (errors) => {
                            console.error(
                                '[PaddySales] Validation errors:',
                                errors
                            )
                        })}
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
                                                {t(
                                                    'salesReports.paddy.form.fields.date'
                                                )}
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
                                                                : 'Pick a date'}
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
                                                    'salesReports.paddy.form.fields.partyName'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <PaginatedCombobox
                                                    value={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    paginatedList={party}
                                                    placeholder='Search party...'
                                                    emptyText='No parties found'
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
                                                    'salesReports.paddy.form.fields.brokerName'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <PaginatedCombobox
                                                    value={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    paginatedList={broker}
                                                    placeholder='Search broker...'
                                                    emptyText='No brokers found'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='saleType'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'salesReports.paddy.form.fields.type'
                                                )}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className='w-full'>
                                                    {paddySaleTypeOptions.map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
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

                                {/* DO बिक्री specific fields */}
                                {isDOSale && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name='doNumber'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {t(
                                                            'salesReports.paddy.form.fields.doNumber'
                                                        )}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='Enter DO number'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='dhanMotaQty'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {t(
                                                            'salesReports.paddy.form.fields.paddyMota'
                                                        )}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            step='0.01'
                                                            placeholder='0.00'
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    +e.target
                                                                        .value
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
                                            name='dhanPatlaQty'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {t(
                                                            'salesReports.paddy.form.fields.paddyPatla'
                                                        )}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            step='0.01'
                                                            placeholder='0.00'
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    +e.target
                                                                        .value
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
                                            name='dhanSarnaQty'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {t(
                                                            'salesReports.paddy.form.fields.paddySarna'
                                                        )}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            step='0.01'
                                                            placeholder='0.00'
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    +e.target
                                                                        .value
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
                                    </>
                                )}

                                {/* Common Paddy fields */}

                                <FormField
                                    control={form.control}
                                    name='dhanType'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'salesReports.paddy.form.fields.paddyType'
                                                )}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className='w-full'>
                                                    {dhanTypeOptions.map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
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
                                <FormField
                                    control={form.control}
                                    name='dhanQty'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'salesReports.paddy.form.fields.quantity'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            +e.target.value
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
                                    name='paddyRatePerQuintal'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'salesReports.paddy.form.fields.paddyRate'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            +e.target.value
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
                                    name='deliveryType'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'salesReports.paddy.form.fields.delivery'
                                                )}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select' />
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
                                <FormField
                                    control={form.control}
                                    name='discountPercent'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'salesReports.paddy.form.fields.batav'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            +e.target.value
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
                                                {t(
                                                    'salesReports.paddy.form.fields.brokerage'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            +e.target.value
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

                                {/* Gunny fields */}

                                <FormField
                                    control={form.control}
                                    name='gunnyOption'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'salesReports.paddy.form.fields.gunnyIncluded'
                                                )}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select' />
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

                                {isGunnySahit && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name='newGunnyRate'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {t(
                                                            'salesReports.paddy.form.fields.newGunnyRate'
                                                        )}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            step='0.01'
                                                            placeholder='0.00'
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    +e.target
                                                                        .value
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
                                            name='oldGunnyRate'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {t(
                                                            'salesReports.paddy.form.fields.oldGunnyRate'
                                                        )}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            step='0.01'
                                                            placeholder='0.00'
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    +e.target
                                                                        .value
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
                                            name='plasticGunnyRate'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {t(
                                                            'salesReports.paddy.form.fields.plasticGunnyRate'
                                                        )}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            step='0.01'
                                                            placeholder='0.00'
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    +e.target
                                                                        .value
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
                            >{t('common.cancel')}</Button>
                            <Button type='submit' disabled={isLoading}>
                                {isLoading
                                    ? isEditing
                                        ? t('common.updating')
                                        : t('common.adding')
                                    : isEditing
                                      ? t('common.update')
                                      : t('common.add')}{' '}
                                {t('salesReports.paddy.title')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
