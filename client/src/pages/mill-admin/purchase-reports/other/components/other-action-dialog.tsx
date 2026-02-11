import { useEffect, useState } from 'react'
import * as React from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { otherPurchaseAndSalesQtyTypeOptions } from '@/constants/purchase-form'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxList,
    ComboboxEmpty,
    ComboboxCollection,
} from '@/components/ui/combobox'
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
import { useCreateOtherPurchase, useUpdateOtherPurchase } from '../data/hooks'
import { otherPurchaseSchema, type OtherPurchase } from '../data/schema'
import { useOther } from './other-provider'
import { usePartyList } from '@/pages/mill-admin/input-reports/party-report/data/hooks'
import { useBrokerList } from '@/pages/mill-admin/input-reports/broker-report/data/hooks'

type OtherActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: OtherPurchase | null
}

export function OtherActionDialog({
    open,
    onOpenChange,
    currentRow,
}: OtherActionDialogProps) {
    const { millId } = useOther()
    const { mutateAsync: createOtherPurchase, isPending: isCreating } =
        useCreateOtherPurchase(millId)
    const { mutateAsync: updateOtherPurchase, isPending: isUpdating } =
        useUpdateOtherPurchase(millId)

    const [partyPage, setPartyPage] = useState(1)
    const [brokerPage, setBrokerPage] = useState(1)
    const [allParties, setAllParties] = useState<string[]>([])
    const [allBrokers, setAllBrokers] = useState<string[]>([])
    const [hasMoreParties, setHasMoreParties] = useState(true)
    const [hasMoreBrokers, setHasMoreBrokers] = useState(true)
    const [isLoadingMoreParties, setIsLoadingMoreParties] = useState(false)
    const [isLoadingMoreBrokers, setIsLoadingMoreBrokers] = useState(false)

    // Dynamic limit: 10 for first page, 5 for subsequent pages
    const partyLimit = partyPage === 1 ? 10 : 5
    const brokerLimit = brokerPage === 1 ? 10 : 5

    // Fetch party list from API with pagination
    const { data: partyListData } = usePartyList(
        millId,
        {
            page: partyPage,
            limit: partyLimit,
            sortBy: 'partyName',
            sortOrder: 'asc',
        },
        { enabled: open && !!millId }
    )

    // Fetch broker list from API with pagination
    const { data: brokerListData } = useBrokerList({
        millId: open ? millId : '',
        page: brokerPage,
        pageSize: brokerLimit,
    })

    // Extract party names from API response and accumulate
    React.useEffect(() => {
        if (partyListData?.parties) {
            console.log(
                'Party data received:',
                partyListData.parties.length,
                'parties on page',
                partyPage
            )
            const newParties = partyListData.parties.map(
                (party) => party.partyName
            )
            setAllParties((prev) => {
                // Only add if not already in the list
                const combined = [...prev, ...newParties]
                return Array.from(new Set(combined))
            })
            // Check if there are more parties to load
            setHasMoreParties(partyListData.parties.length === partyLimit)
            setIsLoadingMoreParties(false)
        }
    }, [partyListData, partyLimit, partyPage])

    // Extract broker names from API response and accumulate
    React.useEffect(() => {
        if (brokerListData?.brokers) {
            console.log(
                'Broker data received:',
                brokerListData.brokers.length,
                'brokers on page',
                brokerPage
            )
            const newBrokers = brokerListData.brokers.map(
                (broker) => broker.brokerName
            )
            setAllBrokers((prev) => {
                // Only add if not already in the list
                const combined = [...prev, ...newBrokers]
                return Array.from(new Set(combined))
            })
            // Check if there are more brokers to load
            setHasMoreBrokers(brokerListData.brokers.length === brokerLimit)
            setIsLoadingMoreBrokers(false)
        }
    }, [brokerListData, brokerLimit, brokerPage])

    // Reset accumulated data when dialog opens
    useEffect(() => {
        if (open) {
            setAllParties([])
            setAllBrokers([])
            setPartyPage(1)
            setBrokerPage(1)
            setHasMoreParties(true)
            setHasMoreBrokers(true)
            setIsLoadingMoreParties(false)
            setIsLoadingMoreBrokers(false)
        }
    }, [open])

    // Handle scroll for party list
    const handlePartyScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget
        const bottom =
            target.scrollHeight - target.scrollTop <= target.clientHeight + 5

        if (bottom && hasMoreParties && !isLoadingMoreParties) {
            console.log('Loading more parties... Current page:', partyPage)
            setIsLoadingMoreParties(true)
            setPartyPage((prev) => prev + 1)
        }
    }

    // Handle scroll for broker list
    const handleBrokerScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget
        const bottom =
            target.scrollHeight - target.scrollTop <= target.clientHeight + 5

        if (bottom && hasMoreBrokers && !isLoadingMoreBrokers) {
            console.log('Loading more brokers... Current page:', brokerPage)
            setIsLoadingMoreBrokers(true)
            setBrokerPage((prev) => prev + 1)
        }
    }

    const isEditing = !!currentRow
    const isLoading = isCreating || isUpdating
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const form = useForm<OtherPurchase>({
        resolver: zodResolver(otherPurchaseSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            partyName: '',
            brokerName: '',
            otherPurchaseName: '',
            otherPurchaseQty: 0,
            qtyType: '',
            rate: 0,
            discountPercent: 0,
            gst: 0,
        } as OtherPurchase,
    })

    useEffect(() => {
        if (open) {
            if (currentRow) {
                form.reset(currentRow)
            } else {
                form.reset({
                    date: format(new Date(), 'yyyy-MM-dd'),
                    partyName: '',
                    brokerName: '',
                    otherPurchaseName: '',
                    otherPurchaseQty: 0,
                    qtyType: '',
                    rate: 0,
                    discountPercent: 0,
                    gst: 0,
                } as OtherPurchase)
            }
        }
    }, [currentRow, open, form])

    const onSubmit = async (data: OtherPurchase) => {
        try {
            if (isEditing && currentRow?._id) {
                await updateOtherPurchase({
                    purchaseId: currentRow._id,
                    data,
                })
            } else {
                await createOtherPurchase(data)
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
                        {isEditing ? 'Edit' : 'Add'} Other Purchase
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update' : 'Enter'} the purchase details
                        below
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
                                            <FormLabel>Date</FormLabel>
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
                                            <FormLabel>Party Name</FormLabel>
                                            <FormControl>
                                                <Combobox
                                                    value={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    items={allParties}
                                                >
                                                    <ComboboxInput
                                                        placeholder='Search party...'
                                                        showClear
                                                    />
                                                    <ComboboxContent>
                                                        <ComboboxList
                                                            onScroll={
                                                                handlePartyScroll
                                                            }
                                                        >
                                                            <ComboboxCollection>
                                                                {(party) => (
                                                                    <ComboboxItem
                                                                        value={
                                                                            party
                                                                        }
                                                                    >
                                                                        {party}
                                                                    </ComboboxItem>
                                                                )}
                                                            </ComboboxCollection>
                                                            <ComboboxEmpty>
                                                                No parties found
                                                            </ComboboxEmpty>
                                                            {isLoadingMoreParties && (
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
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    items={allBrokers}
                                                >
                                                    <ComboboxInput
                                                        placeholder='Search broker...'
                                                        showClear
                                                    />
                                                    <ComboboxContent>
                                                        <ComboboxList
                                                            onScroll={
                                                                handleBrokerScroll
                                                            }
                                                        >
                                                            <ComboboxCollection>
                                                                {(broker) => (
                                                                    <ComboboxItem
                                                                        value={
                                                                            broker
                                                                        }
                                                                    >
                                                                        {broker}
                                                                    </ComboboxItem>
                                                                )}
                                                            </ComboboxCollection>
                                                            <ComboboxEmpty>
                                                                No brokers found
                                                            </ComboboxEmpty>
                                                            {isLoadingMoreBrokers && (
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
                                    name='otherPurchaseName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Item Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter item name'
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
                                    name='otherPurchaseQty'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target
                                                                .valueAsNumber
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
                                    name='qtyType'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || ''}
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
                                <FormField
                                    control={form.control}
                                    name='rate'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Rate</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder=''
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target
                                                                .valueAsNumber
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
                                    name='discountPercent'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Discount (%)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target
                                                                .valueAsNumber
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
                                    name='gst'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>GST (%)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target
                                                                .valueAsNumber
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
                                        : 'Add'}{' '}
                                Purchase
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
