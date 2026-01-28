import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
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
import { gunnySalesSchema, type GunnySales } from '../data/schema'

type GunnySalesActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: GunnySales | null
}

export function GunnySalesActionDialog({
    open,
    onOpenChange,
    currentRow,
}: GunnySalesActionDialogProps) {
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const form = useForm<GunnySales>({
        resolver: zodResolver(gunnySalesSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            partyName: '',
            newGunnyQty: undefined,
            newGunnyRate: undefined,
            oldGunnyQty: undefined,
            oldGunnyRate: undefined,
            plasticGunnyQty: undefined,
            plasticGunnyRate: undefined,
        } as GunnySales,
    })

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
                    ? 'Gunny sale updated successfully'
                    : 'Gunny sale added successfully'
            },
            error: isEditing
                ? 'Failed to update sale'
                : 'Failed to add sale',
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit' : 'Add'} Gunny Sale
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update' : 'Enter'} gunny sale details
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
                                        name='newGunnyQty'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                   New Gunny Quantity
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
                                        name='oldGunnyQty'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                   Old Gunny Quantity
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
                                        name='plasticGunnyQty'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Plastic Gunny Quantity 
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