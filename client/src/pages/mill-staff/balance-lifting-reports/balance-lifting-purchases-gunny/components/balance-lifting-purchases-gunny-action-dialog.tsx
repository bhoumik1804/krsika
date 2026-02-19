import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePartyList } from '@/pages/mill-admin/input-reports/party-report/data/hooks'
import {
    useCreateGunnyPurchase,
    useUpdateGunnyPurchase,
} from '@/pages/mill-admin/purchase-reports/gunny/data/hooks'
import { CalendarIcon } from 'lucide-react'
import { useParams } from 'react-router'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    gunnyPurchaseSchema,
    type BalanceLiftingPurchasesGunny,
} from '../data/schema'
import { useTranslation } from 'react-i18next'

type BalanceLiftingPurchasesGunnyActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: BalanceLiftingPurchasesGunny | null
}

export function BalanceLiftingPurchasesGunnyActionDialog({
    open,
    onOpenChange,
    currentRow,
}: BalanceLiftingPurchasesGunnyActionDialogProps) {
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
        currentRow?.partyName ?? undefined
    )
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)
    const createMutation = useCreateGunnyPurchase(millId || '')
    const updateMutation = useUpdateGunnyPurchase(millId || '')

    const form = useForm<BalanceLiftingPurchasesGunny>({
        resolver: zodResolver(gunnyPurchaseSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            partyName: '',
            deliveryType: '',
            newGunnyQty: undefined,
            newGunnyRate: undefined,
            oldGunnyQty: undefined,
            oldGunnyRate: undefined,
            plasticGunnyQty: undefined,
            plasticGunnyRate: undefined,
        } as BalanceLiftingPurchasesGunny,
    })

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset()
        }
    }, [currentRow, form])

    const onSubmit = async (data: BalanceLiftingPurchasesGunny) => {
        const submissionData = {
            date: data.date,
            partyName: data.partyName || undefined,
            deliveryType: data.deliveryType || undefined,
            newGunnyQty: data.newGunnyQty,
            newGunnyRate: data.newGunnyRate,
            oldGunnyQty: data.oldGunnyQty,
            oldGunnyRate: data.oldGunnyRate,
            plasticGunnyQty: data.plasticGunnyQty,
            plasticGunnyRate: data.plasticGunnyRate,
        }
        try {
            if (isEditing && currentRow?._id) {
                await updateMutation.mutateAsync({
                    _id: currentRow._id,
                    ...submissionData,
                })
            } else {
                await createMutation.mutateAsync(submissionData)
            }
            onOpenChange(false)
            form.reset()
        } catch {
            // Error handled by mutation onError
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t('balanceLifting.purchase.gunny.form.title_edit')
                            : t('balanceLifting.purchase.gunny.form.title_add')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t(
                                'balanceLifting.purchase.gunny.form.description_edit'
                            )
                            : t(
                                'balanceLifting.purchase.gunny.form.description_add'
                            )}
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
                                                {t(
                                                    'balanceLifting.purchase.gunny.form.fields.date'
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
                                                    'balanceLifting.purchase.gunny.form.fields.partyName'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <PaginatedCombobox
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    paginatedList={party}
                                                    placeholder={t(
                                                        'common.search'
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
                                                    'balanceLifting.purchase.gunny.form.fields.deliveryType'
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
                                                        <SelectValue placeholder='Select' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className='w-full'>
                                                    {gunnyDeliveryTypeOptions.map(
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
                                    name='newGunnyQty'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'balanceLifting.purchase.gunny.form.fields.newGunnyQty'
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
                                    name='newGunnyRate'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'balanceLifting.purchase.gunny.form.fields.newGunnyRate'
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
                                    name='oldGunnyQty'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'balanceLifting.purchase.gunny.form.fields.oldGunnyQty'
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
                                                    'balanceLifting.purchase.gunny.form.fields.oldGunnyRate'
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
                                    name='plasticGunnyQty'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'balanceLifting.purchase.gunny.form.fields.plasticGunnyQty'
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
                                                    'balanceLifting.purchase.gunny.form.fields.plasticGunnyRate'
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
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => onOpenChange(false)}
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
                                {isEditing ? t('common.update') : t('common.add')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
