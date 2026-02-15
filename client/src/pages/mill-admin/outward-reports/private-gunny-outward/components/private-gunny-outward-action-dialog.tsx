import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
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
    useCreatePrivateGunnyOutward,
    useUpdatePrivateGunnyOutward,
} from '../data/hooks'
import {
    PrivateGunnyOutwardSchema,
    type PrivateGunnyOutward,
} from '../data/schema'
import { useParams } from 'react-router'
import { usePartyBrokerSelection } from '@/hooks/use-party-broker-selection'
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxCollection,
} from '@/components/ui/combobox'

type PrivateGunnyOutwardActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PrivateGunnyOutward | null
}

export function PrivateGunnyOutwardActionDialog({
    open,
    onOpenChange,
    currentRow,
}: PrivateGunnyOutwardActionDialogProps) {
    const { millId } = useParams<{ millId: string }>()
    const { party } = usePartyBrokerSelection(
        millId || '',
        open,
        currentRow?.partyName || undefined
    )
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const createMutation = useCreatePrivateGunnyOutward(millId || '')
    const updateMutation = useUpdatePrivateGunnyOutward(millId || '')

    const form = useForm<PrivateGunnyOutward>({
        resolver: zodResolver(PrivateGunnyOutwardSchema),
        defaultValues: {
            _id: '',
            date: '',
            gunnyPurchaseDealNumber: '',
            partyName: '',
            newGunnyQty: undefined,
            oldGunnyQty: undefined,
            plasticGunnyQty: undefined,
            truckNo: '',
        },
    })

    useEffect(() => {
        if (open) {
            if (currentRow) {
                form.reset(currentRow)
            } else {
                form.reset({
                    _id: '',
                    date: format(new Date(), 'yyyy-MM-dd'),
                    gunnyPurchaseDealNumber: '',
                    partyName: '',
                    newGunnyQty: undefined,
                    oldGunnyQty: undefined,
                    plasticGunnyQty: undefined,
                    truckNo: '',
                })
            }
        }
    }, [currentRow, form, open])

    const onSubmit = async (data: PrivateGunnyOutward) => {
        try {
            const submissionData = {
                ...data,
                partyName: data.partyName || undefined,
            }

            if (isEditing && currentRow?._id) {
                // Exclude _id from update payload (sent as separate id param)
                const { _id, ...updatePayload } = submissionData
                await updateMutation.mutateAsync({
                    id: currentRow._id,
                    payload: updatePayload,
                })
            } else {
                // Exclude _id when creating new entry
                const { _id, ...createPayload } = submissionData
                await createMutation.mutateAsync(createPayload)
            }
            onOpenChange(false)
        } catch (error) {
            // Error handling is done in the mutation hooks
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-xl'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit' : 'Add'} Private Gunny Outward
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
                            {/* Date */}
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

                            {/* Gunny Purchase Deal Number */}
                            <FormField
                                control={form.control}
                                name='gunnyPurchaseDealNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Gunny Purchase Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='GPN-1234'
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Party Name */}
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

                            {/* New Gunny Qty */}
                            <FormField
                                control={form.control}
                                name='newGunnyQty'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Gunny Qty</FormLabel>
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

                            {/* Old Gunny Qty */}
                            <FormField
                                control={form.control}
                                name='oldGunnyQty'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Old Gunny Qty</FormLabel>
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

                            {/* Plastic Gunny Qty */}
                            <FormField
                                control={form.control}
                                name='plasticGunnyQty'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Plastic Gunny Qty</FormLabel>
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
                            {/* Truck No */}
                            <FormField
                                control={form.control}
                                name='truckNo'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Truck No.</FormLabel>
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
                        </div>

                        <DialogFooter>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => onOpenChange(false)}
                                disabled={
                                    createMutation.isPending ||
                                    updateMutation.isPending
                                }
                            >
                                Cancel
                            </Button>
                            <Button
                                type='submit'
                                disabled={
                                    createMutation.isPending ||
                                    updateMutation.isPending
                                }
                            >
                                {createMutation.isPending ||
                                    updateMutation.isPending
                                    ? 'Saving...'
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
