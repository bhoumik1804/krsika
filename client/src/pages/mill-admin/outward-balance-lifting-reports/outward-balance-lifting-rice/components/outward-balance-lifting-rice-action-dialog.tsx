import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBrokerList } from '@/pages/mill-admin/input-reports/broker-report/data/hooks'
import { usePartyList } from '@/pages/mill-admin/input-reports/party-report/data/hooks'
import { CalendarIcon } from 'lucide-react'
import { usePaginatedList } from '@/hooks/use-paginated-list'
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
import { PaginatedCombobox } from '@/components/ui/paginated-combobox'
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
    useCreatePrivateRiceOutward,
    useUpdatePrivateRiceOutward,
} from '../data/hooks'
import {
    PrivateRiceOutwardSchema,
    type PrivateRiceOutward,
} from '../data/schema'
import { useOutwardBalanceLiftingRice } from './outward-balance-lifting-rice-provider'

type OutwardBalanceLiftingRiceActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OutwardBalanceLiftingRiceActionDialog({
    open,
    onOpenChange,
}: OutwardBalanceLiftingRiceActionDialogProps) {
    const { currentRow, millId } = useOutwardBalanceLiftingRice()
    const { mutateAsync: createEntry, isPending: isCreating } =
        useCreatePrivateRiceOutward(millId)
    const { mutateAsync: updateEntry, isPending: isUpdating } =
        useUpdatePrivateRiceOutward(millId)

    const party = usePaginatedList(
        millId,
        open,
        {
            useListHook: usePartyList,
            extractItems: (data) =>
                data.parties
                    .map((c: { partyName: string }) => c.partyName)
                    .filter(Boolean) as string[],
            hookParams: { sortBy: 'partyName', sortOrder: 'asc' },
        },
        currentRow?.partyName ?? undefined
    )

    const broker = usePaginatedList(
        millId,
        open,
        {
            useListHook: useBrokerList,
            extractItems: (data) =>
                data.brokers
                    .map((c: { brokerName: string }) => c.brokerName)
                    .filter(Boolean) as string[],
            hookParams: { sortBy: 'brokerName', sortOrder: 'asc' },
        },
        currentRow?.brokerName ?? undefined
    )

    const isEditing = !!currentRow
    const isLoading = isCreating || isUpdating
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const form = useForm<PrivateRiceOutward>({
        resolver: zodResolver(PrivateRiceOutwardSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            partyName: '',
            brokerName: '',
            riceSaleDealNumber: '',
            lotNo: '',
            fciNan: '',
            riceType: 'Regular',
            riceQty: 0,
            gunnyNew: 0,
            gunnyOld: 0,
            gunnyPlastic: 0,
            juteWeight: 0,
            plasticWeight: 0,
            truckNumber: '',
            truckRst: '',
            truckWeight: 0,
            gunnyWeight: 0,
            netWeight: 0,
        } as PrivateRiceOutward,
    })

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset({
                date: format(new Date(), 'yyyy-MM-dd'),
                partyName: '',
                brokerName: '',
                riceSaleDealNumber: '',
                lotNo: '',
                fciNan: '',
                riceType: 'Regular',
                riceQty: 0,
                gunnyNew: 0,
                gunnyOld: 0,
                gunnyPlastic: 0,
                juteWeight: 0,
                plasticWeight: 0,
                truckNumber: '',
                truckRst: '',
                truckWeight: 0,
                gunnyWeight: 0,
                netWeight: 0,
            } as PrivateRiceOutward)
        }
    }, [currentRow, open, form])

    const onSubmit = async (data: PrivateRiceOutward) => {
        try {
            if (isEditing) {
                await updateEntry({
                    id: currentRow?._id || '',
                    data,
                })
            } else {
                await createEntry(data)
            }
            onOpenChange(false)
            form.reset()
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit' : 'Add'} Private Rice Outward
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
                                name='partyName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Party Name</FormLabel>
                                        <FormControl>
                                            <PaginatedCombobox
                                                value={field.value ?? undefined}
                                                onValueChange={field.onChange}
                                                paginatedList={party}
                                                placeholder='Search party...'
                                                emptyText='No parties found'
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
                                            <PaginatedCombobox
                                                value={field.value ?? undefined}
                                                onValueChange={field.onChange}
                                                paginatedList={broker}
                                                placeholder='Search broker...'
                                                emptyText='No brokers found'
                                            />
                                        </FormControl>
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
                                            defaultValue={
                                                field.value ?? undefined
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select rice type' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='Regular'>
                                                    Regular
                                                </SelectItem>
                                                <SelectItem value='Premium'>
                                                    Premium
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Add more fields as per schema */}
                            <FormField
                                control={form.control}
                                name='riceQty'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rice Qty</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                placeholder='0.00'
                                                {...field}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        isNaN(val) ? '' : val
                                                    )
                                                }}
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
