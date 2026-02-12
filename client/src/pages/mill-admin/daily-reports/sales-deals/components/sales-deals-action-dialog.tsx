import { useEffect, useState } from 'react'
import * as React from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
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
import { salesDealSchema, type SalesDeal } from '../data/schema'
import { useParams } from 'react-router'
import { useSalesDeals } from './sales-deals-provider'
import { useBrokerList } from '@/pages/mill-admin/input-reports/broker-report/data/hooks'

type SalesDealsActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: SalesDeal | null
}

export function SalesDealsActionDialog({
    open,
    onOpenChange,
    currentRow,
}: SalesDealsActionDialogProps) {
    const { millId } = useParams<{ millId: string }>()
    const [brokerPage, setBrokerPage] = useState(1)
    const [allBrokers, setAllBrokers] = useState<string[]>([])
    const [hasMoreBrokers, setHasMoreBrokers] = useState(true)
    const [isLoadingMoreBrokers, setIsLoadingMoreBrokers] = useState(false)

    const brokerLimit = brokerPage === 1 ? 10 : 5

    const { data: brokerListData } = useBrokerList({
        millId: open ? millId : '',
        page: brokerPage,
        pageSize: brokerLimit,
    })

    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const form = useForm<SalesDeal>({
        resolver: zodResolver(salesDealSchema),
        defaultValues: {
            date: '',
            buyerName: '',
            brokerName: '',
            commodity: '',
            quantity: 0,
            rate: 0,
            totalAmount: 0,
            status: 'pending',
            paymentTerms: '',
            remarks: '',
        },
    })

    // Extract broker names from API response and accumulate
    React.useEffect(() => {
        if (brokerListData?.brokers) {
            const newBrokers = brokerListData.brokers.map((broker) => broker.brokerName)
            setAllBrokers((prev) => {
                const combined = [...prev, ...newBrokers]
                return Array.from(new Set(combined))
            })
            setHasMoreBrokers(brokerListData.brokers.length === brokerLimit)
            setIsLoadingMoreBrokers(false)
        }
    }, [brokerListData, brokerLimit, brokerPage])

    // Reset accumulated data when dialog opens
    useEffect(() => {
        if (open) {
            setAllBrokers([])
            setBrokerPage(1)
            setHasMoreBrokers(true)
            setIsLoadingMoreBrokers(false)
        }
    }, [open])

    // Handle scroll for broker list
    const handleBrokerScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget
        const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 5
        if (bottom && hasMoreBrokers && !isLoadingMoreBrokers) {
            setIsLoadingMoreBrokers(true)
            setBrokerPage((prev) => prev + 1)
        }
    }

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset({
                date: new Date().toISOString().split('T')[0],
                status: 'pending',
            })
        }
    }, [currentRow, form])

    const onSubmit = () => {
        toast.promise(sleep(2000), {
            loading: isEditing
                ? 'Updating sales deal...'
                : 'Adding sales deal...',
            success: () => {
                onOpenChange(false)
                form.reset()
                return isEditing
                    ? 'Sales deal updated successfully'
                    : 'Sales deal added successfully'
            },
            error: isEditing
                ? 'Failed to update sales deal'
                : 'Failed to add sales deal',
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit' : 'Add'} Sales Deal
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update' : 'Enter'} the sales deal details
                        below
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
                                name='buyerName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Buyer Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter buyer name'
                                                {...field}
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
                                        <FormLabel>Broker Name</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                items={allBrokers}
                                            >
                                                <ComboboxInput
                                                    placeholder='Search broker...'
                                                    showClear
                                                />
                                                <ComboboxContent>
                                                    <ComboboxList onScroll={handleBrokerScroll}>
                                                        <ComboboxCollection>
                                                            {(broker) => (
                                                                <ComboboxItem value={broker}>
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
                                name='commodity'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Commodity</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='e.g. Rice, Bran'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='quantity'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity (Qtl)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='rate'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rate per Qtl</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='totalAmount'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='paymentTerms'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Terms</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='e.g. Cash, Credit 7 Days'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='status'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select status' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='pending'>
                                                    Pending
                                                </SelectItem>
                                                <SelectItem value='completed'>
                                                    Completed
                                                </SelectItem>
                                                <SelectItem value='cancelled'>
                                                    Cancelled
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name='remarks'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Remarks</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Optional remarks'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type='submit'>
                                {isEditing ? 'Update' : 'Add'} Deal
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
