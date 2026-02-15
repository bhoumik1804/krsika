import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { otherPurchaseAndSalesQtyTypeOptions } from '@/constants/purchase-form'
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
import { useCreateOtherInward, useUpdateOtherInward } from '../data/hooks'
import { otherInwardSchema, type OtherInward } from '../data/schema'
import { useOtherInward } from './other-inward-provider'
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxList,
    ComboboxEmpty,
    ComboboxCollection,
} from '@/components/ui/combobox'
import { usePartyBrokerSelection } from '@/hooks/use-party-broker-selection'

type OtherInwardActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: OtherInward | null
}

export function OtherInwardActionDialog({
    open,
    onOpenChange,
    currentRow,
}: OtherInwardActionDialogProps) {
    const { millId } = useOtherInward()
    const { mutateAsync: createOtherInward, isPending: isCreating } =
        useCreateOtherInward(millId)
    const { mutateAsync: updateOtherInward, isPending: isUpdating } =
        useUpdateOtherInward(millId)

    const { party, broker } = usePartyBrokerSelection(
        millId,
        open,
        currentRow?.partyName || undefined,
        currentRow?.brokerName || undefined
    )

    const isEditing = !!currentRow
    const isLoading = isCreating || isUpdating
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const form = useForm<OtherInward>({
        resolver: zodResolver(otherInwardSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            otherPurchaseDealNumber: '',
            itemName: '',
            quantity: undefined,
            quantityType: '',
            partyName: '',
            brokerName: '',
            gunnyNew: undefined,
            gunnyOld: undefined,
            gunnyPlastic: undefined,
            juteGunnyWeight: undefined,
            plasticGunnyWeight: undefined,
            truckNumber: '',
            rstNumber: '',
            truckWeight: undefined,
            gunnyWeight: undefined,
            netWeight: undefined,
        },
    })

    useEffect(() => {
        if (open) {
            if (currentRow) {
                form.reset(currentRow)
            } else {
                form.reset({
                    date: format(new Date(), 'yyyy-MM-dd'),
                    otherPurchaseDealNumber: '',
                    itemName: '',
                    quantity: undefined,
                    quantityType: 'Kg',
                    partyName: '',
                    brokerName: '',
                    gunnyNew: undefined,
                    gunnyOld: undefined,
                    gunnyPlastic: undefined,
                    juteGunnyWeight: undefined,
                    plasticGunnyWeight: undefined,
                    truckNumber: '',
                    rstNumber: '',
                    truckWeight: undefined,
                    gunnyWeight: undefined,
                    netWeight: undefined,
                })
            }
        }
    }, [currentRow, open, form])

    const onSubmit = async (data: OtherInward) => {
        try {
            const submissionData = {
                ...data,
                partyName: data.partyName || undefined,
                brokerName: data.brokerName || undefined,
            }

            if (isEditing && currentRow?._id) {
                await updateOtherInward({
                    entryId: currentRow._id,
                    data: submissionData,
                })
            } else {
                await createOtherInward(submissionData)
            }
            onOpenChange(false)
            form.reset()
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit' : 'Add'} Record
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update' : 'Enter'} the details below
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
                                        <FormLabel>Date</FormLabel>
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
                                name='otherPurchaseDealNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Other Purchase Deal Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter Deal ID'
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
                                name='itemName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Item Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter Item Name'
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='grid grid-cols-2 gap-2'>
                                <FormField
                                    control={form.control}
                                    name='quantity'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target
                                                                .valueAsNumber
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
                                    name='quantityType'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Qty Type</FormLabel>
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
                                                    {otherPurchaseAndSalesQtyTypeOptions.map(
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
                            </div>
                            <FormField
                                control={form.control}
                                name='partyName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Party Name</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                items={party.items}
                                            >
                                                <ComboboxInput
                                                    placeholder='Search Party...'
                                                    showClear
                                                />
                                                <ComboboxContent>
                                                    <ComboboxList onScroll={party.onScroll}>
                                                        <ComboboxCollection>
                                                            {(p) => (
                                                                <ComboboxItem value={p}>
                                                                    {p}
                                                                </ComboboxItem>
                                                            )}
                                                        </ComboboxCollection>
                                                        <ComboboxEmpty>
                                                            No parties found
                                                        </ComboboxEmpty>
                                                        {party.isLoadingMore && (
                                                            <div className='py-2 text-center text-xs text-muted-foreground'>
                                                                Loading more...
                                                            </div>
                                                        )}
                                                    </ComboboxList>
                                                </ComboboxContent>
                                            </Combobox>
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
                                        <FormLabel>Broker Name</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                items={broker.items}
                                            >
                                                <ComboboxInput
                                                    placeholder='Search Broker...'
                                                    showClear
                                                />
                                                <ComboboxContent>
                                                    <ComboboxList onScroll={broker.onScroll}>
                                                        <ComboboxCollection>
                                                            {(b) => (
                                                                <ComboboxItem value={b}>
                                                                    {b}
                                                                </ComboboxItem>
                                                            )}
                                                        </ComboboxCollection>
                                                        <ComboboxEmpty>
                                                            No brokers found
                                                        </ComboboxEmpty>
                                                        {broker.isLoadingMore && (
                                                            <div className='py-2 text-center text-xs text-muted-foreground'>
                                                                Loading more...
                                                            </div>
                                                        )}
                                                    </ComboboxList>
                                                </ComboboxContent>
                                            </Combobox>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='gunnyNew'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gunny (New)</FormLabel>
                                        <FormControl>
                                            <Input
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
                            <FormField
                                control={form.control}
                                name='gunnyOld'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gunny (Old)</FormLabel>
                                        <FormControl>
                                            <Input
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
                            <FormField
                                control={form.control}
                                name='gunnyPlastic'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gunny (Plastic)</FormLabel>
                                        <FormControl>
                                            <Input
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
                            <FormField
                                control={form.control}
                                name='juteGunnyWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Jute Gunny Weight</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
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
                            <FormField
                                control={form.control}
                                name='plasticGunnyWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Plastic Gunny Weight
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
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
                            <FormField
                                control={form.control}
                                name='truckNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Truck No</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter Truck No'
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
                                        <FormLabel>RST No</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter RST No'
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
                                        <FormLabel>Truck Weight</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
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
                            <FormField
                                control={form.control}
                                name='gunnyWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gunny Weight</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
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
                            <FormField
                                control={form.control}
                                name='netWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Net Weight</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
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
                        </div>
                        <DialogFooter>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type='submit' disabled={isLoading}>
                                {isLoading
                                    ? isEditing
                                        ? 'Updating...'
                                        : 'Adding...'
                                    : isEditing
                                        ? 'Update'
                                        : 'Add'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
