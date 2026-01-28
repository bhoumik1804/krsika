import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import {
    paddySaleTypeOptions,
    dhanTypeOptions,
    deliveryTypeOptions,
    gunnyTypeOptions,
} from '@/constants/sale-form'
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
import { paddySalesSchema, type PaddySales } from '../data/schema'

type PaddySalesActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PaddySales | null
}

export function PaddySalesActionDialog({
    open,
    onOpenChange,
    currentRow,
}: PaddySalesActionDialogProps) {
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const form = useForm<PaddySales>({
        resolver: zodResolver(paddySalesSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            partyName: '',
            brokerName: '',
            saleType: '',
            doNumber: '',
            dhanMotaQty: undefined,
            dhanPatlaQty: undefined,
            dhanSarnaQty: undefined,
            dhanType: '',
            dhanQty: undefined,
            paddyRatePerQuintal: undefined,
            deliveryType: '',
            discountPercent: undefined,
            brokerage: undefined,
            gunnyOption: '',
            newGunnyRate: undefined,
            oldGunnyRate: undefined,
            plasticGunnyRate: undefined,
        } as PaddySales,
    })

    const watchSaleType = form.watch('saleType')
    const watchGunnyOption = form.watch('gunnyOption')

    const isDOSale = watchSaleType === paddySaleTypeOptions[0]?.value
    const isGunnySahit = watchGunnyOption === gunnyTypeOptions[1]?.value

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset()
        }
    }, [currentRow, form])

    const onSubmit = () => {
        toast.promise(sleep(2000), {
            loading: isEditing ? 'Updating sale...' : 'Adding sale...',
            success: () => {
                onOpenChange(false)
                form.reset()
                return isEditing
                    ? 'Sale updated successfully'
                    : 'Sale added successfully'
            },
            error: isEditing ? 'Failed to update sale' : 'Failed to add sale',
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit' : 'Add'} Paddy Sale
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update' : 'Enter'} the sale details below
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
                                    name='saleType'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sale Type</FormLabel>
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
                                                    {paddySaleTypeOptions.map(
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

                                {/* DO बिक्री specific fields */}
                                {isDOSale && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name='doNumber'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        DO Number
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='Enter DO number'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='dhanMotaQty'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Dhan Mota Qty
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            step='0.01'
                                                            placeholder='0.00'
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    +e.target
                                                                        .value
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
                                            name='dhanPatlaQty'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Dhan Patla Qty
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            step='0.01'
                                                            placeholder='0.00'
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    +e.target
                                                                        .value
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
                                            name='dhanSarnaQty'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Dhan Sarna Qty
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            step='0.01'
                                                            placeholder='0.00'
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    +e.target
                                                                        .value
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
                                    </>
                                )}

                                {/* Common Paddy fields */}

                                <FormField
                                    control={form.control}
                                    name='gunnyOption'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dhan Type</FormLabel>
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
                                                    {dhanTypeOptions.map(
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
                                    name='dhanQty'
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
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            +e.target.value
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
                                    name='paddyRatePerQuintal'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Rate (per Quintal)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            +e.target.value
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
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            +e.target.value
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
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            +e.target.value
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

                                {/* Gunny fields */}

                                <FormField
                                    control={form.control}
                                    name='gunnyOption'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gunny Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
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
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    +e.target
                                                                        .value
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
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    +e.target
                                                                        .value
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
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    +e.target
                                                                        .value
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
                                {isEditing ? 'Update' : 'Add'} Sale
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
