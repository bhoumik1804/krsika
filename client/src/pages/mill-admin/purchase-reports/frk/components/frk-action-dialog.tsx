import { useEffect, useState } from 'react'
import * as React from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
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
import { frkPurchaseSchema, type FrkPurchaseData } from '../data/schema'
import { useCreateFrkPurchase, useUpdateFrkPurchase } from '../data/hooks'
import { useFrk } from './frk-provider'
import { usePartyList } from '@/pages/mill-admin/input-reports/party-report/data/hooks'

type FrkActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function FrkActionDialog({
    open,
    onOpenChange,
}: FrkActionDialogProps) {
    const { currentRow, millId } = useFrk()
    const { mutateAsync: createFrkPurchase, isPending: isCreating } =
        useCreateFrkPurchase(millId)
    const { mutateAsync: updateFrkPurchase, isPending: isUpdating } =
        useUpdateFrkPurchase(millId)

    const [partyPage, setPartyPage] = useState(1)
    const [allParties, setAllParties] = useState<string[]>([])
    const [hasMoreParties, setHasMoreParties] = useState(true)
    const [isLoadingMoreParties, setIsLoadingMoreParties] = useState(false)

    // Dynamic limit: 10 for first page, 5 for subsequent pages
    const partyLimit = partyPage === 1 ? 10 : 5

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

    // Reset accumulated data when dialog opens
    useEffect(() => {
        if (open) {
            setAllParties([])
            setPartyPage(1)
            setHasMoreParties(true)
            setIsLoadingMoreParties(false)
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

    const isEditing = !!currentRow
    const isLoading = isCreating || isUpdating
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const form = useForm<FrkPurchaseData>({
        resolver: zodResolver(frkPurchaseSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            partyName: '',
            frkQty: undefined,
            frkRate: undefined,
            gst: undefined,
        } as FrkPurchaseData,
    })

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset({
                date: format(new Date(), 'yyyy-MM-dd'),
                partyName: '',
                frkQty: undefined,
                frkRate: undefined,
                gst: undefined,
            } as FrkPurchaseData)
        }
    }, [currentRow, open, form])

    const onSubmit = async (data: FrkPurchaseData) => {
        try {
            if (isEditing) {
                await updateFrkPurchase({
                    purchaseId: currentRow?._id || '',
                    data,
                })
            } else {
                await createFrkPurchase(data)
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
                        {isEditing ? 'Edit' : 'Add'} FRK Purchase
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
                                    name='frkQty'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                FRK Quantity (Qtl)
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
                                    name='frkRate'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>FRK Rate (per Qtl)</FormLabel>
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
