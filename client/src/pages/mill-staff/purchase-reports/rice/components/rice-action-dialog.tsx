import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import {
    riceTypeOptions,
    deliveryTypeOptions,
    fciOrNANOptions,
    lotOrOtherTypeOptions,
    frkTypeOptions,
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
import { ricePurchaseSchema, type RicePurchase } from '../data/schema'

type RiceActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: RicePurchase | null
}

export function RiceActionDialog({
    open,
    onOpenChange,
    currentRow,
}: RiceActionDialogProps) {
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const form = useForm<RicePurchase>({
        resolver: zodResolver(ricePurchaseSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            partyName: '',
            brokerName: '',
            deliveryType: '',
            lotOrOther: '',
            fciOrNAN: '',
            riceType: '',
            riceQty: undefined,
            riceRate: undefined,
            discountPercent: undefined,
            brokeragePerQuintal: undefined,
            gunnyType: '',
            newGunnyRate: undefined,
            oldGunnyRate: undefined,
            plasticGunnyRate: undefined,
            frkType: '',
            frkRatePerQuintal: undefined,
            lotNumber: '',
        } as RicePurchase,
    })

    // Watchers for conditional rendering
    const watchPurchaseType = form.watch('lotOrOther')
    const watchGunnyType = form.watch('gunnyType')
    const watchFrkType = form.watch('frkType')

    // LOT Purchase is the first option ("LOT खरीदी")
    const isLotPurchase = watchPurchaseType === lotOrOtherTypeOptions[0]?.value

    // Show gunny rates if "साहित (भाव में)" is selected (Index 1)
    const isGunnySahit = watchGunnyType === gunnyTypeOptions[1]?.value

    // Show FRK Rate if "FRK साहित" is selected (Index 0)
    const isFrkSahit = watchFrkType === frkTypeOptions[0]?.value

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset()
        }
    }, [currentRow, form])

    const onSubmit = () => {
        toast.promise(sleep(2000), {
            loading: isEditing ? 'Updating purchase...' : 'Adding purchase...',
            success: () => {
                onOpenChange(false)
                form.reset()
                return isEditing
                    ? 'Rice purchase updated successfully'
                    : 'Rice purchase added successfully'
            },
            error: isEditing
                ? 'Failed to update purchase'
                : 'Failed to add purchase',
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit' : 'Add'} Rice Purchase
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update' : 'Enter'} rice purchase details
                        below.
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
                                                <Input
                                                    placeholder='Enter party name'
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
                                                <Input
                                                    placeholder='Enter broker name'
                                                    {...field}
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
                                            <FormLabel>Delivery Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className='w-full'>
                                                    {deliveryTypeOptions.map(
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
                                    name='lotOrOther'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>LOT/Other</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className='w-full'>
                                                    {lotOrOtherTypeOptions.map(
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

                                {/* LOT Purchase Fields */}
                                {isLotPurchase && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name='fciOrNAN'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        FCI/NAN
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder='Select' />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className='w-full'>
                                                            {fciOrNANOptions.map(
                                                                (option) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option.value
                                                                        }
                                                                        value={
                                                                            option.value
                                                                        }
                                                                    >
                                                                        {
                                                                            option.label
                                                                        }
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
                                            name='lotNumber'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        LOT No.
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='Enter LOT No.'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='frkType'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>FRK</FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder='Select' />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className='w-full'>
                                                            {frkTypeOptions.map(
                                                                (option) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option.value
                                                                        }
                                                                        value={
                                                                            option.value
                                                                        }
                                                                    >
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {isFrkSahit && (
                                            <FormField
                                                control={form.control}
                                                name='frkRatePerQuintal'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            FRK Rate (per Qtl)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type='number'
                                                                step='0.01'
                                                                placeholder='0.00'
                                                                {...field}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const val =
                                                                        e.target
                                                                            .valueAsNumber
                                                                    field.onChange(
                                                                        isNaN(
                                                                            val
                                                                        )
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
                                    </>
                                )}

                                <FormField
                                    control={form.control}
                                    name='riceType'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Rice Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className='w-full'>
                                                    {riceTypeOptions.map(
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

                                {/* Common Fields */}
                                <FormField
                                    control={form.control}
                                    name='riceQty'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Quantity (Qtl)
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
                                    name='riceRate'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Rice Rate (per Qtl)
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
                                    name='brokeragePerQuintal'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Brokerage (per Qtl)
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

                                {/* Gunny Options */}
                                <FormField
                                    control={form.control}
                                    name='gunnyType'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gunny Option</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className='w-full'>
                                                    {gunnyTypeOptions.map(
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

                                {isGunnySahit && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name='newGunnyRate'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        New Gunny Rate
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
                                            name='oldGunnyRate'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Old Gunny Rate
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
                                            name='plasticGunnyRate'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Plastic Gunny Rate
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
                                    </>
                                )}
                            </div>
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
                                {isEditing ? 'Update' : 'Add'} Purchase
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
