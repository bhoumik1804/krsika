import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { labourTypeOptions } from '@/constants/purchase-form'
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
import { Textarea } from '@/components/ui/textarea'
import { labourOtherSchema, type LabourOther } from '../data/schema'

const labourGroupOptions = [
    { label: 'रामलाल टीम', value: 'रामलाल टीम' },
    { label: 'श्यामलाल टीम', value: 'श्यामलाल टीम' },
    { label: 'मोहन टीम', value: 'मोहन टीम' },
    { label: 'सोहन टीम', value: 'सोहन टीम' },
    { label: 'राधेश्याम टीम', value: 'राधेश्याम टीम' },
]

type LabourOtherActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: LabourOther | null
}

export function LabourOtherActionDialog({
    open,
    onOpenChange,
    currentRow,
}: LabourOtherActionDialogProps) {
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const form = useForm<LabourOther>({
        resolver: zodResolver(labourOtherSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            labourType: '',
            labourGroupName: '',
            numberOfGunny: undefined,
            labourRate: undefined,
            workDetail: '',
            totalPrice: undefined,
        },
    })

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset()
        }
    }, [currentRow, form])

    const labourType = form.watch('labourType')
    const isOtherType = labourType === labourTypeOptions[3].value

    const onSubmit = () => {
        toast.promise(sleep(2000), {
            loading: isEditing ? 'Updating...' : 'Adding...',
            success: () => {
                onOpenChange(false)
                form.reset()
                return isEditing ? 'Updated successfully' : 'Added successfully'
            },
            error: isEditing ? 'Failed to update' : 'Failed to add',
        })
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
                                name='labourType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Labour Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || ''}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='select labour type' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {labourTypeOptions.map(
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
                            <FormField
                                control={form.control}
                                name='labourGroupName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Labour Group name</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || ''}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='select labour group name' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='w-full'>
                                                {labourGroupOptions.map(
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
                            {!isOtherType && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name='numberOfGunny'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Number of Gunny
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        {...field}
                                                        onChange={(e) => {
                                                            const val =
                                                                e.target
                                                                    .valueAsNumber
                                                            field.onChange(
                                                                Number.isNaN(
                                                                    val
                                                                )
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
                                        name='labourRate'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Labour Rate
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
                                                                Number.isNaN(
                                                                    val
                                                                )
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
                                </>
                            )}
                            {isOtherType && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name='workDetail'
                                        render={({ field }) => (
                                            <FormItem className='col-span-2'>
                                                <FormLabel>
                                                    Work Detail
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder='Enter work details'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='totalPrice'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Total Price
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
                                                                Number.isNaN(
                                                                    val
                                                                )
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
                                </>
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
