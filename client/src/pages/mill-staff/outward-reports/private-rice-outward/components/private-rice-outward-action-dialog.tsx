import { useEffect, useState, useRef } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRiceSalesList } from '@/pages/mill-admin/sales-reports/rice-sales/data/hooks'
import type { RiceSalesResponse } from '@/pages/mill-admin/sales-reports/rice-sales/data/types'
import { CalendarIcon } from 'lucide-react'
import { fciOrNANOptions, riceTypeOptions } from '@/constants/purchase-form'
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
import { usePrivateRiceOutward } from './private-rice-outward-provider'

type PrivateRiceOutwardActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PrivateRiceOutward | null
}

export function PrivateRiceOutwardActionDialog({
    open,
    onOpenChange,
    currentRow,
}: PrivateRiceOutwardActionDialogProps) {
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)
    const { millId, setOpen: setDialogOpen } = usePrivateRiceOutward()
    const riceSaleDataRef = useRef<RiceSalesResponse[]>([])

    const useRiceSalesListCompat = (params: any) => {
        return useRiceSalesList(
            millId || '',
            { ...params, pageSize: params.limit },
            { enabled: open }
        )
    }

    const riceSaleDeal = usePaginatedList(
        millId || '',
        open,
        {
            useListHook: useRiceSalesListCompat,
            extractItems: (data: any) => {
                riceSaleDataRef.current = data.sales || [] // API returns 'sales' array
                return data.sales
                    .map((p: RiceSalesResponse) => p.riceSalesDealNumber)
                    .filter(Boolean) as string[]
            },
            hookParams: { sortBy: 'date', sortOrder: 'desc' },
        },
        currentRow?.riceSaleDealNumber || undefined
    )

    const handleDealSelect = (dealId: string) => {
        form.setValue('riceSaleDealNumber', dealId)
        const sale = riceSaleDataRef.current.find(
            (p) => p.riceSalesDealNumber === dealId
        )
        if (sale) {
            if (sale.partyName) form.setValue('partyName', sale.partyName)
            if (sale.brokerName) form.setValue('brokerName', sale.brokerName)
            if (sale.riceType) form.setValue('riceType', sale.riceType)
            if (sale.riceQty) form.setValue('riceQty', sale.riceQty)
            if (sale.fciOrNAN) form.setValue('fciNan', sale.fciOrNAN)
            if (sale.lotNumber) form.setValue('lotNo', sale.lotNumber)
            // Gunny details auto-fill if needed, currently manual in Rice Sales vs specific breakdown here
        }
    }
    const createMutation = useCreatePrivateRiceOutward(millId)
    const updateMutation = useUpdatePrivateRiceOutward(millId)

    const form = useForm<PrivateRiceOutward>({
        resolver: zodResolver(PrivateRiceOutwardSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            riceSaleDealNumber: '',
            partyName: '',
            brokerName: '',
            lotNo: '',
            fciNan: '',
            riceType: '',
            riceQty: undefined,
            gunnyNew: undefined,
            gunnyOld: undefined,
            gunnyPlastic: undefined,
            juteWeight: undefined,
            plasticWeight: undefined,
            truckNumber: '',
            truckRst: '',
            truckWeight: undefined,
            gunnyWeight: undefined,
            netWeight: undefined,
        },
    })

    useEffect(() => {
        if (!open) return

        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset({
                date: format(new Date(), 'yyyy-MM-dd'),
                riceSaleDealNumber: '',
                partyName: '',
                brokerName: '',
                lotNo: '',
                fciNan: '',
                riceType: '',
                riceQty: undefined,
                gunnyNew: undefined,
                gunnyOld: undefined,
                gunnyPlastic: undefined,
                juteWeight: undefined,
                plasticWeight: undefined,
                truckNumber: '',
                truckRst: '',
                truckWeight: undefined,
                gunnyWeight: undefined,
                netWeight: undefined,
            })
        }
    }, [currentRow, form, open])

    const onSubmit = async (data: PrivateRiceOutward) => {
        try {
            const submissionData = {
                ...data,
                partyName: data.partyName || undefined,
                brokerName: data.brokerName || undefined,
            }

            if (isEditing && currentRow?._id) {
                await updateMutation.mutateAsync({
                    id: currentRow._id,
                    data: submissionData,
                })
            } else {
                await createMutation.mutateAsync(submissionData)
            }
            setDialogOpen(null)
            onOpenChange(false)
        } catch {
            // Error is handled by mutation hooks
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-3xl overflow-y-auto'>
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

                            {/* Sale Deal Number */}
                            <FormField
                                control={form.control}
                                name='riceSaleDealNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Rice Sale Deal Number
                                        </FormLabel>
                                        <FormControl>
                                            <PaginatedCombobox
                                                value={field.value || ''}
                                                onValueChange={handleDealSelect}
                                                paginatedList={riceSaleDeal}
                                                placeholder='Search deal...'
                                                emptyText='No deals found'
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
                                            <Input
                                                placeholder='Enter party name'
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Broker Name */}
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
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* LOT No. */}
                            <FormField
                                control={form.control}
                                name='lotNo'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>LOT No.</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='LOT-1234'
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* FCI/NAN */}
                            <FormField
                                control={form.control}
                                name='fciNan'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>FCI/NAN</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ''}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select FCI/NAN' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='w-full'>
                                                {fciOrNANOptions.map(
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

                            {/* Rice Type */}
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
                                                    <SelectValue placeholder='Select type' />
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

                            {/* Rice Quantity */}
                            <FormField
                                control={form.control}
                                name='riceQty'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rice Quantity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Gunny New */}
                            <FormField
                                control={form.control}
                                name='gunnyNew'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gunny (New)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Gunny Old */}
                            <FormField
                                control={form.control}
                                name='gunnyOld'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gunny (Old)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Gunny Plastic */}
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
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Jute Weight */}
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
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Plastic Weight */}
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
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Truck Number */}
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
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* RST No. */}
                            <FormField
                                control={form.control}
                                name='truckRst'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>RST No.</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='RST-12345'
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Truck Weight */}
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
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Gunny Weight */}
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
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Final/Net Weight */}
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
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
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
