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
import { useCreateFrkInward, useUpdateFrkInward } from '../data/hooks'
import { frkInwardSchema, type FrkInward } from '../data/schema'
import { useFrkInward } from './frk-inward-provider'
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

type FrkInwardActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: FrkInward | null
}

export function FrkInwardActionDialog({
    open,
    onOpenChange,
    currentRow,
}: FrkInwardActionDialogProps) {
    const { millId } = useFrkInward()
    const { mutateAsync: createFrkInward, isPending: isCreating } =
        useCreateFrkInward(millId)
    const { mutateAsync: updateFrkInward, isPending: isUpdating } =
        useUpdateFrkInward(millId)

    const { party } = usePartyBrokerSelection(
        millId,
        open,
        currentRow?.partyName || undefined
    )
    const isEditing = !!currentRow
    const isLoading = isCreating || isUpdating
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const getDefaultValues = () => ({
        date: format(new Date(), 'yyyy-MM-dd'),
        frkPurchaseDealNumber: '',
        partyName: '',
        gunnyPlastic: undefined,
        plasticWeight: undefined,
        truckNumber: '',
        rstNumber: '',
        truckWeight: undefined,
        gunnyWeight: undefined,
        netWeight: undefined,
    })

    const form = useForm<FrkInward>({
        resolver: zodResolver(frkInwardSchema),
        defaultValues: getDefaultValues(),
    })

    useEffect(() => {
        if (open) {
            if (currentRow) {
                form.reset(currentRow)
            } else {
                form.reset(getDefaultValues())
            }
        }
    }, [currentRow, open, form])

    const onSubmit = async (data: FrkInward) => {
        try {
            const { _id, ...rest } = data
            const payload = {
                ...rest,
                partyName: rest.partyName || undefined,
            }
            if (isEditing && currentRow?._id) {
                await updateFrkInward({
                    id: currentRow._id,
                    data: payload,
                })
            } else {
                await createFrkInward(payload)
            }
            onOpenChange(false)
            form.reset(getDefaultValues())
        } catch (error) {
            console.error('FRK inward form submission error:', error)
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
                                name='frkPurchaseDealNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            FRK Purchase Deal Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter Deal Number'
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
                                name='gunnyPlastic'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gunny (Plastic)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
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
                                name='plasticWeight'
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
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
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
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
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
                                name='gunnyWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gunny Weight</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
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
                                name='netWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Net Weight</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
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
