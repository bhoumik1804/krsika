import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { useParams } from 'react-router'
import { riceTypeOptions } from '@/constants/purchase-form'
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
import { useCreateMillingRice, useUpdateMillingRice } from '../data/hooks'
import { millingRiceSchema, type MillingRice } from '../data/schema'

type MillingRiceActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: MillingRice | null
}

export function MillingRiceActionDialog({
    open,
    onOpenChange,
    currentRow,
}: MillingRiceActionDialogProps) {
    const { millId } = useParams<{ millId: string }>()
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const createMutation = useCreateMillingRice(millId || '')
    const updateMutation = useUpdateMillingRice(millId || '')

    const form = useForm<MillingRice>({
        resolver: zodResolver(millingRiceSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            riceType: '',
            hopperInGunny: undefined,
            hopperInQintal: undefined,
            riceQuantity: undefined,
            ricePercentage: undefined,
            khandaQuantity: undefined,
            khandaPercentage: undefined,
            silkyKodhaQuantity: undefined,
            silkyKodhaPercentage: undefined,
            wastagePercentage: undefined,
        },
    })

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset({
                date: format(new Date(), 'yyyy-MM-dd'),
                riceType: '',
                // Reset other fields to undefined/defaults
            })
        }
    }, [currentRow, form, open])

    const onSubmit = (data: MillingRice) => {
        if (isEditing && currentRow?._id) {
            updateMutation.mutate(
                { id: currentRow._id, ...data },
                {
                    onSuccess: () => {
                        onOpenChange(false)
                        form.reset()
                    },
                }
            )
        } else {
            createMutation.mutate(data, {
                onSuccess: () => {
                    onOpenChange(false)
                    form.reset()
                },
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
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
                                name='riceType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rice Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ''}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select rice type' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='w-full'>
                                                {riceTypeOptions.map((type) => (
                                                    <SelectItem
                                                        key={type.value}
                                                        value={type.value}
                                                    >
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='hopperInGunny'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hopper (Gunny)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='hopperInQintal'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hopper (Quintal)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='riceQuantity'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rice (Quintal)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='ricePercentage'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rice %</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='khandaQuantity'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Khanda (Quintal)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='khandaPercentage'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Khanda %</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='silkyKodhaQuantity'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Silky Kodha (Quintal)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='silkyKodhaPercentage'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Silky Kodha %</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='wastagePercentage'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Wastage %</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
