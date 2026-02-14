import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import {
    paddyTypeOptions,
    paddyPurchaseTypeOptions,
    gunnyTypeOptions,
} from '@/constants/purchase-form'
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
import {
    useCreatePrivatePaddyInward,
    useUpdatePrivatePaddyInward,
} from '../data/hooks'
import {
    privatePaddyInwardSchema,
    type PrivatePaddyInward,
} from '../data/schema'
import { privatePaddyInward } from './private-paddy-inward-provider'
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

type PrivatePaddyInwardActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PrivatePaddyInward | null
}

export function PrivatePaddyInwardActionDialog({
    open,
    onOpenChange,
    currentRow,
}: PrivatePaddyInwardActionDialogProps) {
    const { millId } = privatePaddyInward()
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const { party, broker } = usePartyBrokerSelection(
        millId,
        open,
        currentRow?.partyName || undefined,
        currentRow?.brokerName || undefined
    )

    const createMutation = useCreatePrivatePaddyInward(millId)
    const updateMutation = useUpdatePrivatePaddyInward(millId)

    const getDefaultValues = useMemo(
        () => ({
            date: format(new Date(), 'yyyy-MM-dd'),
            partyName: '',
            brokerName: '',
            paddyPurchaseDealNumber: '',
            purchaseType: undefined,
            gunnyOption: undefined,
            doNumber: '',
            committeeName: '',
            truckNumber: '',
            balanceDo: undefined,
            gunnyNew: undefined,
            gunnyOld: undefined,
            gunnyPlastic: undefined,
            juteWeight: undefined,
            plasticWeight: undefined,
            gunnyWeight: undefined,
            rstNumber: undefined,
            truckLoadWeight: undefined,
            paddyType: undefined,
            paddyMota: undefined,
            paddyPatla: undefined,
            paddySarna: undefined,
            paddyMahamaya: undefined,
            paddyRbGold: undefined,
        }),
        []
    )

    const form = useForm<PrivatePaddyInward>({
        resolver: zodResolver(privatePaddyInwardSchema),
        defaultValues: getDefaultValues,
    })

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset(getDefaultValues)
        }
    }, [currentRow, form, getDefaultValues])

    const onSubmit = (data: PrivatePaddyInward) => {
        const submissionData = {
            ...data,
            partyName: data.partyName || undefined,
            brokerName: data.brokerName || undefined,
        }

        if (isEditing && currentRow?._id) {
            updateMutation.mutate(
                { id: currentRow._id, data: submissionData },
                {
                    onSuccess: () => {
                        toast.success('Updated successfully')
                        onOpenChange(false)
                        form.reset(getDefaultValues)
                    },
                    onError: (error) => {
                        toast.error(error.message || 'Failed to update')
                    },
                }
            )
        } else {
            createMutation.mutate(submissionData, {
                onSuccess: () => {
                    toast.success('Added successfully')
                    onOpenChange(false)
                    form.reset(getDefaultValues)
                },
                onError: (error) => {
                    toast.error(error.message || 'Failed to add')
                },
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
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
                            {/* Date & Deal Info */}
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
                                name='paddyPurchaseDealNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Paddy Purchase Deal Number
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
                                name='purchaseType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Purchase Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={
                                                field.value || undefined
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select Type' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='w-full'>
                                                {paddyPurchaseTypeOptions.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
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
                            {form.watch('purchaseType') ===
                                paddyPurchaseTypeOptions[0].value && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name='doNumber'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>DO Number</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='Enter DO Number'
                                                            {...field}
                                                            value={
                                                                field.value ||
                                                                ''
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='committeeName'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Committee Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='Enter Committee Name'
                                                            {...field}
                                                            value={
                                                                field.value ||
                                                                ''
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='balanceDo'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Balance DO
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            step='0.01'
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
                                    </>
                                )}

                            {/* Gunny Options */}
                            <FormField
                                control={form.control}
                                name='gunnyOption'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gunny Option</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={
                                                field.value || undefined
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select Option' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='w-full'>
                                                {gunnyTypeOptions.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
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

                            {/* Gunny Details */}
                            <FormField
                                control={form.control}
                                name='gunnyNew'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gunny New</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        isNaN(val) ? '' : val
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
                                name='gunnyOld'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gunny Old</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        isNaN(val) ? '' : val
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
                                name='gunnyPlastic'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gunny Plastic</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        isNaN(val) ? '' : val
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

                            {/* Weights */}
                            <FormField
                                control={form.control}
                                name='juteWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Jute Gunny Weight</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        isNaN(val) ? '' : val
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
                                            Plastic Gunny Weight (kg.)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        isNaN(val) ? '' : val
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
                                        <FormLabel>
                                            Gunny Weight (kg.)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        isNaN(val) ? '' : val
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

                            {/* Truck Details */}
                            <FormField
                                control={form.control}
                                name='truckNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Truck Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='XX-00-XX-0000'
                                                {...field}
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
                                        <FormLabel>RST Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter RST Number'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='truckLoadWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Truck Load Weight (Qtl.)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        isNaN(val) ? '' : val
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

                            {/* Paddy Details */}
                            <FormField
                                control={form.control}
                                name='paddyType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Paddy Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select Type' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='w-full'>
                                                {paddyTypeOptions.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
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
                            {form.watch('paddyType') ===
                                paddyTypeOptions[0].value && (
                                    <FormField
                                        control={form.control}
                                        name='paddyMota'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Paddy Mota (Qtl.)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        step='0.01'
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
                                )}
                            {form.watch('paddyType') ===
                                paddyTypeOptions[1].value && (
                                    <FormField
                                        control={form.control}
                                        name='paddyPatla'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Paddy Patla (Qtl.)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        step='0.01'
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
                                )}
                            {form.watch('paddyType') ===
                                paddyTypeOptions[2].value && (
                                    <FormField
                                        control={form.control}
                                        name='paddySarna'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Paddy Sarna (Qtl.)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        step='0.01'
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
                                )}
                            {form.watch('paddyType') ===
                                paddyTypeOptions[3].value && (
                                    <FormField
                                        control={form.control}
                                        name='paddyMahamaya'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Paddy Mahamaya (Qtl.)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        step='0.01'
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
                                )}
                            {form.watch('paddyType') ===
                                paddyTypeOptions[4].value && (
                                    <FormField
                                        control={form.control}
                                        name='paddyRbGold'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Paddy RB Gold (Qtl.)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        step='0.01'
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
                                )}
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
