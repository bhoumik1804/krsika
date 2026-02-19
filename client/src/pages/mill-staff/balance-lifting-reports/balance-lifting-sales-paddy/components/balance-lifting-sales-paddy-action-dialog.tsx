import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePartyList } from '@/pages/mill-admin/input-reports/party-report/data/hooks'
import { CalendarIcon } from 'lucide-react'
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
import { useCreatePaddySale, useUpdatePaddySale } from '../data/hooks'
import { paddySalesSchema, type PaddySales } from '../data/schema'
import { useBalanceLiftingSalesPaddy } from './balance-lifting-sales-paddy-provider'
import { useTranslation } from 'react-i18next'

type BalanceLiftingSalesPaddyActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function BalanceLiftingSalesPaddyActionDialog({
    open,
    onOpenChange,
}: BalanceLiftingSalesPaddyActionDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { currentRow, millId } = useBalanceLiftingSalesPaddy()
    const { mutateAsync: createSale, isPending: isCreating } =
        useCreatePaddySale()
    const { mutateAsync: updateSale, isPending: isUpdating } =
        useUpdatePaddySale()

    const party = usePaginatedList(
        millId || '',
        open,
        {
            useListHook: usePartyList,
            extractItems: (data) =>
                data.parties
                    .map((c: { partyName: string }) => c.partyName)
                    .filter(Boolean) as string[],
            hookParams: { sortBy: 'partyName', sortOrder: 'asc' },
        },
        currentRow?.partyName ?? undefined
    )

    const isEditing = !!currentRow
    const isLoading = isCreating || isUpdating
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const form = useForm<PaddySales>({
        resolver: zodResolver(paddySalesSchema) as Resolver<PaddySales>,
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            partyName: '',
            dhanQty: 0,
            saleType: 'अन्य (मिल से बिक्री)',
            brokerName: '',
            doNumber: '',
            dhanMotaQty: 0,
            dhanPatlaQty: 0,
            dhanSarnaQty: 0,
            dhanType: 'Mota',
            paddyRatePerQuintal: 0,
            deliveryType: 'Mill to Mill',
            discountPercent: 0,
            brokerage: 0,
            gunnyOption: 'New',
            newGunnyRate: 0,
            oldGunnyRate: 0,
            plasticGunnyRate: 0,
        },
    })

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset({
                date: format(new Date(), 'yyyy-MM-dd'),
                partyName: '',
                dhanQty: 0,
                saleType: 'अन्य (मिल से बिक्री)',
                brokerName: '',
                doNumber: '',
                dhanMotaQty: 0,
                dhanPatlaQty: 0,
                dhanSarnaQty: 0,
                dhanType: 'Mota',
                paddyRatePerQuintal: 0,
                deliveryType: 'Mill to Mill',
                discountPercent: 0,
                brokerage: 0,
                gunnyOption: 'New',
                newGunnyRate: 0,
                oldGunnyRate: 0,
                plasticGunnyRate: 0,
            })
        }
    }, [currentRow, open, form])

    const onSubmit = async (data: PaddySales) => {
        try {
            if (isEditing) {
                await updateSale({
                    id: currentRow?._id || '',
                    data,
                })
            } else {
                await createSale(data)
            }
            onOpenChange(false)
            form.reset()
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t('balanceLifting.sales.paddy.form.title_edit')
                            : t('balanceLifting.sales.paddy.form.title_add')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t('balanceLifting.sales.paddy.form.description_edit')
                            : t('balanceLifting.sales.paddy.form.description_add')}
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
                                            <FormLabel>{t('balanceLifting.sales.paddy.form.fields.date')}</FormLabel>
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
                                                                : t('common.pickDate')}
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
                                            <FormLabel>{t('balanceLifting.sales.paddy.form.fields.partyName')}</FormLabel>
                                            <FormControl>
                                                <PaginatedCombobox
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    paginatedList={party}
                                                    placeholder={t('common.searchObject', { object: t('balanceLifting.sales.paddy.form.fields.partyName') })}
                                                    emptyText={t('common.noResults')}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='dhanQty'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('balanceLifting.sales.paddy.form.fields.paddyQty')}</FormLabel>
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
