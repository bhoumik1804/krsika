import { useEffect, useState, useMemo, useRef } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGunnyPurchaseList } from '@/pages/mill-admin/purchase-reports/gunny/data/hooks'
import type { GunnyPurchaseResponse } from '@/pages/mill-admin/purchase-reports/gunny/data/types'
import { CalendarIcon } from 'lucide-react'
import { gunnyDeliveryTypeOptions } from '@/constants/purchase-form'
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
import { useCreateGunnyInward, useUpdateGunnyInward } from '../data/hooks'
import { gunnyInwardSchema, type GunnyInward } from '../data/schema'
import { gunnyInward } from './gunny-inward-provider'

const useGunnyPurchaseListCompat = (params: any) => {
    return useGunnyPurchaseList(params)
}

type GunnyInwardActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function GunnyInwardActionDialog({
    open,
    onOpenChange,
}: GunnyInwardActionDialogProps) {
    const { millId, currentRow } = gunnyInward()
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const { mutate: createInward, isPending: isCreating } =
        useCreateGunnyInward(millId)
    const { mutate: updateInward, isPending: isUpdating } =
        useUpdateGunnyInward(millId)

    const purchaseDataRef = useRef<GunnyPurchaseResponse[]>([])

    const gunnyDeal = usePaginatedList(
        millId,
        open,
        {
            useListHook: useGunnyPurchaseListCompat,
            extractItems: (data: any) => {
                purchaseDataRef.current = data.purchases || []
                return data.purchases
                    .map(
                        (p: GunnyPurchaseResponse) => p.gunnyPurchaseDealNumber
                    )
                    .filter(Boolean) as string[]
            },
            hookParams: { sortBy: 'date', sortOrder: 'desc' },
        },
        currentRow?.gunnyPurchaseDealNumber || undefined
    )

    const handleDealSelect = (dealId: string) => {
        form.setValue('gunnyPurchaseDealNumber', dealId)
        const purchase = purchaseDataRef.current.find(
            (p) => p.gunnyPurchaseDealNumber === dealId
        )
        if (purchase) {
            if (purchase.partyName)
                form.setValue('partyName', purchase.partyName)
            if (purchase.deliveryType)
                form.setValue('delivery', purchase.deliveryType)

            // Map quantities correctly, checking for undefined/null to allow 0
            if (
                purchase.newGunnyQty !== undefined &&
                purchase.newGunnyQty !== null
            )
                form.setValue('gunnyNew', purchase.newGunnyQty)
            if (
                purchase.oldGunnyQty !== undefined &&
                purchase.oldGunnyQty !== null
            )
                form.setValue('gunnyOld', purchase.oldGunnyQty)
            if (
                purchase.plasticGunnyQty !== undefined &&
                purchase.plasticGunnyQty !== null
            )
                form.setValue('gunnyPlastic', purchase.plasticGunnyQty)
        }
    }
    const isLoading = isCreating || isUpdating
    const isEditing = !!currentRow

    const getDefaultValues = useMemo(() => {
        if (currentRow) {
            return {
                ...currentRow,
            } as any
        }
        return {
            date: format(new Date(), 'yyyy-MM-dd'),
            gunnyPurchaseDealNumber: '',
            partyName: '',
            delivery: '',
            samitiSangrahan: '',
            gunnyNew: undefined,
            gunnyOld: undefined,
            gunnyPlastic: undefined,
        } as any
    }, [currentRow])

    const form = useForm<GunnyInward>({
        resolver: zodResolver(gunnyInwardSchema),
        defaultValues: getDefaultValues,
    })

    useEffect(() => {
        if (open) {
            form.reset(getDefaultValues)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRow, open, getDefaultValues])

    const onSubmit = (data: GunnyInward) => {
        const submissionData = {
            ...data,
            partyName: data.partyName || undefined,
            gunnyPurchaseDealNumber: data.gunnyPurchaseDealNumber || undefined,
            delivery: data.delivery || undefined,
            samitiSangrahan: data.samitiSangrahan || undefined,
        }
        console.log('Submitting data:', submissionData)

        if (isEditing && currentRow?._id) {
            updateInward(
                {
                    id: currentRow._id,
                    data: {
                        ...submissionData,
                        _id: currentRow._id,
                    },
                },
                {
                    onSuccess: () => {
                        onOpenChange(false)
                        form.reset()
                    },
                }
            )
        } else {
            createInward(submissionData, {
                onSuccess: () => {
                    onOpenChange(false)
                    form.reset()
                },
            })
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
                                                        id='date'
                                                        variant='outline'
                                                        className='w-full justify-start text-left font-normal'
                                                    >
                                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                                        {field.value
                                                            ? format(
                                                                  field.value,
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
                                name='gunnyPurchaseDealNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Gunny Purchase Deal Number
                                        </FormLabel>
                                        <FormControl>
                                            <PaginatedCombobox
                                                value={field.value || ''}
                                                onValueChange={handleDealSelect}
                                                paginatedList={gunnyDeal}
                                                placeholder='Search deal...'
                                                emptyText='No deals found'
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
                                            <Input
                                                placeholder='Enter Party Name'
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
                                name='delivery'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Delivery</FormLabel>
                                        <FormControl>
                                            <Input
                                                id='delivery'
                                                placeholder='Enter Delivery'
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {form.watch('delivery') ===
                                gunnyDeliveryTypeOptions[1].value && (
                                <FormField
                                    control={form.control}
                                    name='samitiSangrahan'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Samiti Sangrahan
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    id='samitiSangrahan'
                                                    placeholder='Enter Samiti Name'
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

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
