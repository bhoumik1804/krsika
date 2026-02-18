import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBrokerList } from '@/pages/mill-admin/input-reports/broker-report/data/hooks'
import { usePartyList } from '@/pages/mill-admin/input-reports/party-report/data/hooks'
import { CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { usePaginatedList } from '@/hooks/use-paginated-list'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
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
import { useCreateBhusaOutward, useUpdateBhusaOutward } from '../data/hooks'
import { bhusaOutwardSchema, type BhusaOutward } from '../data/schema'

type BhusaOutwardActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: BhusaOutward | null
    millId: string
}

export function BhusaOutwardActionDialog({
    open,
    onOpenChange,
    currentRow,
    millId,
}: BhusaOutwardActionDialogProps) {
    const party = usePaginatedList(
        millId,
        open,
        {
            useListHook: usePartyList,
            extractItems: (data) =>
                data.parties
                    .map((c) => c.partyName)
                    .filter(Boolean) as string[],
            hookParams: { sortBy: 'partyName', sortOrder: 'asc' },
        },
        currentRow?.partyName || undefined
    )

    const broker = usePaginatedList(
        millId,
        open,
        {
            useListHook: useBrokerList,
            extractItems: (data) =>
                data.brokers
                    .map((c) => c.brokerName)
                    .filter(Boolean) as string[],
        },
        currentRow?.brokerName || undefined
    )
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const createMutation = useCreateBhusaOutward(millId)
    const updateMutation = useUpdateBhusaOutward(millId)

    const defaultValues = useMemo(
        () => ({
            date: format(new Date(), 'yyyy-MM-dd'),
            bhusaSaleDealNumber: '',
            partyName: '',
            brokerName: '',
            rate: undefined,
            brokerage: undefined,
            truckNo: '',
            truckRst: '',
            truckWeight: undefined,
        }),
        []
    )

    const form = useForm<BhusaOutward>({
        resolver: zodResolver(bhusaOutwardSchema),
        defaultValues,
    })

    useEffect(() => {
        if (open) {
            if (currentRow) {
                form.reset(currentRow)
            } else {
                form.reset(defaultValues)
            }
        }
    }, [currentRow, form, defaultValues, open])

    const onSubmit = (values: BhusaOutward) => {
        const submissionData = {
            ...values,
            partyName: values.partyName || undefined,
            brokerName: values.brokerName || undefined,
        }

        if (isEditing && currentRow?._id) {
            toast.promise(
                updateMutation.mutateAsync({
                    id: currentRow._id,
                    data: submissionData,
                }),
                {
                    loading: 'Updating...',
                    success: () => {
                        onOpenChange(false)
                        return 'Updated successfully'
                    },
                    error: 'Failed to update',
                }
            )
        } else {
            toast.promise(createMutation.mutateAsync(submissionData), {
                loading: 'Adding...',
                success: () => {
                    onOpenChange(false)
                    return 'Added successfully'
                },
                error: 'Failed to add',
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-2xl'>
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
                                name='bhusaSaleDealNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Bhusa Sale Deal Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter deal number'
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
                                                    placeholder='Search party...'
                                                    showClear
                                                />
                                                <ComboboxContent>
                                                    <ComboboxList
                                                        onScroll={
                                                            party.onScroll
                                                        }
                                                    >
                                                        <ComboboxCollection>
                                                            {(p) => (
                                                                <ComboboxItem
                                                                    value={p}
                                                                >
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
                                                    placeholder='Search broker...'
                                                    showClear
                                                />
                                                <ComboboxContent>
                                                    <ComboboxList
                                                        onScroll={
                                                            broker.onScroll
                                                        }
                                                    >
                                                        <ComboboxCollection>
                                                            {(b) => (
                                                                <ComboboxItem
                                                                    value={b}
                                                                >
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
                                name='rate'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rate</FormLabel>
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
                                name='brokerage'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Brokerage</FormLabel>
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
                                name='truckNo'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Truck No</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='XX-00-XX-0000'
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
                                name='truckRst'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>RST No</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='RST-000'
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
                        </div>
                        <DialogFooter>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type='submit'>
                                {isEditing ? 'Update' : 'Add'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
