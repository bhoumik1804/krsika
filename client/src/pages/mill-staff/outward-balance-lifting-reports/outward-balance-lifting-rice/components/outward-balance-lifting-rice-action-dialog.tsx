import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBrokerList } from '@/pages/mill-admin/input-reports/broker-report/data/hooks'
import { usePartyList } from '@/pages/mill-admin/input-reports/party-report/data/hooks'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    useCreatePrivateRiceOutward,
    useUpdatePrivateRiceOutward,
} from '../data/hooks'
import {
    PrivateRiceOutwardSchema,
    type PrivateRiceOutward,
} from '../data/schema'
import { useOutwardBalanceLiftingRice } from './outward-balance-lifting-rice-provider'

type OutwardBalanceLiftingRiceActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OutwardBalanceLiftingRiceActionDialog({
    open,
    onOpenChange,
}: OutwardBalanceLiftingRiceActionDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { currentRow, millId } = useOutwardBalanceLiftingRice()
    const { mutateAsync: createEntry, isPending: isCreating } =
        useCreatePrivateRiceOutward(millId)
    const { mutateAsync: updateEntry, isPending: isUpdating } =
        useUpdatePrivateRiceOutward(millId)

    const party = usePaginatedList(
        millId,
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

    const broker = usePaginatedList(
        millId,
        open,
        {
            useListHook: useBrokerList,
            extractItems: (data) =>
                data.brokers
                    .map((c: { brokerName: string }) => c.brokerName)
                    .filter(Boolean) as string[],
            hookParams: { sortBy: 'brokerName', sortOrder: 'asc' },
        },
        currentRow?.brokerName ?? undefined
    )

    const isEditing = !!currentRow
    const isLoading = isCreating || isUpdating
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const form = useForm<PrivateRiceOutward>({
        resolver: zodResolver(PrivateRiceOutwardSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            partyName: '',
            brokerName: '',
            riceSalesDealNumber: '',
            deliveryType: 'Mill to Mill',
            lotOrOther: 'LOT',
            fciOrNAN: 'FCI',
            riceType: 'Regular',
            riceQty: 0,
            riceRatePerQuintal: 0,
            discountPercent: 0,
            brokeragePerQuintal: 0,
            gunnyType: 'New',
            newGunnyRate: 0,
            oldGunnyRate: 0,
            plasticGunnyRate: 0,
            frkType: 'No',
            frkRatePerQuintal: 0,
            lotNumber: '',
        } as PrivateRiceOutward,
    })

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset({
                date: format(new Date(), 'yyyy-MM-dd'),
                partyName: '',
                brokerName: '',
                riceSalesDealNumber: '',
                deliveryType: 'Mill to Mill',
                lotOrOther: 'LOT',
                fciOrNAN: 'FCI',
                riceType: 'Regular',
                riceQty: 0,
                riceRatePerQuintal: 0,
                discountPercent: 0,
                brokeragePerQuintal: 0,
                gunnyType: 'New',
                newGunnyRate: 0,
                oldGunnyRate: 0,
                plasticGunnyRate: 0,
                frkType: 'No',
                frkRatePerQuintal: 0,
                lotNumber: '',
            } as PrivateRiceOutward)
        }
    }, [currentRow, open, form])

    const onSubmit = async (data: PrivateRiceOutward) => {
        try {
            if (isEditing) {
                await updateEntry({
                    id: currentRow?._id || '',
                    data,
                })
            } else {
                await createEntry(data)
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
                            ? t('outwardRiceSales.editRecord')
                            : t('outwardRiceSales.addRecord')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t('outwardRiceSales.form.updateRiceDetails')
                            : t('outwardRiceSales.form.enterRiceDetails')}
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
                                            {t('outwardRiceSales.form.date')}
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
                                                                  'outwardRiceSales.form.pickADate'
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
                                                'outwardRiceSales.form.partyName'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <PaginatedCombobox
                                                value={field.value ?? undefined}
                                                onValueChange={field.onChange}
                                                paginatedList={party}
                                                placeholder={t(
                                                    'outwardRiceSales.form.searchParty'
                                                )}
                                                emptyText={t(
                                                    'outwardRiceSales.form.noPartiesFound'
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
                                                'outwardRiceSales.form.brokerName'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <PaginatedCombobox
                                                value={field.value ?? undefined}
                                                onValueChange={field.onChange}
                                                paginatedList={broker}
                                                placeholder={t(
                                                    'outwardRiceSales.form.searchBroker'
                                                )}
                                                emptyText={t(
                                                    'outwardRiceSales.form.noBrokersFound'
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
                                                'outwardRiceSales.form.deliveryType'
                                            )}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={t(
                                                            'outwardRiceSales.form.selectDeliveryType'
                                                        )}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='Mill to Mill'>
                                                    Mill to Mill
                                                </SelectItem>
                                                <SelectItem value='Mill to Party'>
                                                    Mill to Party
                                                </SelectItem>
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
                                                'outwardRiceSales.form.lotOrOther'
                                            )}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={t(
                                                            'outwardRiceSales.form.selectType'
                                                        )}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                <SelectItem value='LOT'>
                                                    LOT
                                                </SelectItem>
                                                <SelectItem value='Other'>
                                                    Other
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='fciOrNAN'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outwardRiceSales.form.fciOrNAN'
                                            )}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={t(
                                                            'outwardRiceSales.form.select'
                                                        )}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='FCI'>
                                                    FCI
                                                </SelectItem>
                                                <SelectItem value='NAN'>
                                                    NAN
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='riceType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outwardRiceSales.form.riceType'
                                            )}
                                        </FormLabel>
                                        <Input {...field} />
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
                                            {t('outwardRiceSales.form.riceQty')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target
                                                            .valueAsNumber || 0
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
