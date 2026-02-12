import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { paddyTypeOptions } from '@/constants/purchase-form'
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
    useCreateGovtPaddyInward,
    useUpdateGovtPaddyInward,
} from '../data/hooks'
import { govtPaddyInwardSchema, type GovtPaddyInward } from '../data/schema'
import { useGovtPaddyInward } from './govt-paddy-inward-provider'

type GovtPaddyInwardActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: GovtPaddyInward | null
}

export function GovtPaddyInwardActionDialog({
    open,
    onOpenChange,
    currentRow,
}: GovtPaddyInwardActionDialogProps) {
    const { millId } = useGovtPaddyInward()
    const { mutateAsync: createGovtPaddyInward, isPending: isCreating } =
        useCreateGovtPaddyInward(millId)
    const { mutateAsync: updateGovtPaddyInward, isPending: isUpdating } =
        useUpdateGovtPaddyInward(millId)

    const isEditing = !!currentRow
    const isLoading = isCreating || isUpdating
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const getDefaultValues = useMemo(
        (): GovtPaddyInward => ({
            date: format(new Date(), 'yyyy-MM-dd'),
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
            rstNumber: '',
            truckLoadWeight: undefined,
            paddyType: '',
            paddyMota: undefined,
            paddyPatla: undefined,
            paddySarna: undefined,
            paddyMahamaya: undefined,
            paddyRbGold: undefined,
        }),
        []
    )

    const form = useForm<GovtPaddyInward>({
        resolver: zodResolver(govtPaddyInwardSchema),
        defaultValues: getDefaultValues,
    })

    useEffect(() => {
        if (open) {
            if (currentRow) {
                form.reset(currentRow)
            } else {
                form.reset(getDefaultValues)
            }
        }
    }, [currentRow, open, getDefaultValues])

    const onSubmit = async (data: GovtPaddyInward) => {
        try {
            const { _id, ...payload } = data
            if (isEditing && currentRow?._id) {
                await updateGovtPaddyInward({
                    id: currentRow._id,
                    data: payload,
                })
            } else {
                await createGovtPaddyInward(payload)
            }
            onOpenChange(false)
            form.reset(getDefaultValues)
        } catch (error) {
            console.error('Govt paddy inward form submission error:', error)
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
                            {/* Date, DO, Committee, Balance */}
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
                                name='doNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>DO Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                id='doNumber'
                                                placeholder='Enter DO Number'
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
                                name='committeeName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Committee Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                id='committeeName'
                                                placeholder='Enter Committee Name'
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
                                name='balanceDo'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Balance DO</FormLabel>
                                        <FormControl>
                                            <Input
                                                id='balanceDo'
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

                            {/* Gunny Details */}
                            <FormField
                                control={form.control}
                                name='gunnyNew'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gunny New</FormLabel>
                                        <FormControl>
                                            <Input
                                                id='gunnyNew'
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
                                name='gunnyOld'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gunny Old</FormLabel>
                                        <FormControl>
                                            <Input
                                                id='gunnyOld'
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
                                name='gunnyPlastic'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gunny Plastic</FormLabel>
                                        <FormControl>
                                            <Input
                                                id='gunnyPlastic'
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

                            {/* Weights */}
                            <FormField
                                control={form.control}
                                name='juteWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Jute Gunny Weight</FormLabel>
                                        <FormControl>
                                            <Input
                                                id='juteWeight'
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
                                name='plasticWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Plastic Gunny Weight (kg.)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id='plasticWeight'
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
                                        <FormLabel>
                                            Gunny Weight (kg.)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id='gunnyWeight'
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

                            {/* Truck Details */}
                            <FormField
                                control={form.control}
                                name='truckNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Truck Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                id='truckNumber'
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
                                name='rstNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>RST Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                id='rstNumber'
                                                placeholder='Enter RST Number'
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
                                name='truckLoadWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Truck Load Weight (Qtl.)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id='truckLoadWeight'
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

                            {/* Paddy Details */}
                            <FormField
                                control={form.control}
                                name='paddyType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Paddy Type</FormLabel>
                                        <Select
                                            name='paddyType'
                                            onValueChange={field.onChange}
                                            value={field.value || ''}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    id='paddyType'
                                                    className='w-full'
                                                >
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
                                                    id='paddyMota'
                                                    type='number'
                                                    step='0.01'
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
                                                    id='paddyPatla'
                                                    type='number'
                                                    step='0.01'
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
                                                    id='paddySarna'
                                                    type='number'
                                                    step='0.01'
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
                                                    id='paddyMahamaya'
                                                    type='number'
                                                    step='0.01'
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
                                                    id='paddyRbGold'
                                                    type='number'
                                                    step='0.01'
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
                            )}
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
