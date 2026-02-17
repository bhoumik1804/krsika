import { useEffect, useState } from 'react'
import { useRef } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePaddySalesList } from '@/pages/mill-admin/sales-reports/paddy-sales/data/hooks'
import type { PaddySalesResponse } from '@/pages/mill-admin/sales-reports/paddy-sales/data/types'
import { CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { paddyTypeOptions } from '@/constants/purchase-form'
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
    useCreatePrivatePaddyOutward,
    useUpdatePrivatePaddyOutward,
} from '../data/hooks'
import {
    privatePaddyOutwardSchema,
    type PrivatePaddyOutward,
} from '../data/schema'
import { usePrivatePaddyOutward } from './private-paddy-outward-provider'

type PrivatePaddyOutwardActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PrivatePaddyOutward | null
}

export function PrivatePaddyOutwardActionDialog({
    open,
    onOpenChange,
    currentRow,
}: PrivatePaddyOutwardActionDialogProps) {
    const { t } = useTranslation('mill-staff')
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)
    const { millId, setOpen: setDialogOpen } = usePrivatePaddyOutward()

    const paddySaleDataRef = useRef<PaddySalesResponse[]>([])

    const usePaddySalesListCompat = (params: any) => {
        return usePaddySalesList(
            { ...params, pageSize: params.limit },
            { enabled: open }
        )
    }

    const paddySaleDeal = usePaginatedList(
        millId || '',
        open,
        {
            useListHook: usePaddySalesListCompat,
            extractItems: (data: any) => {
                paddySaleDataRef.current = data.data || []
                return data.data
                    .map((p: PaddySalesResponse) => p.paddySalesDealNumber)
                    .filter(Boolean) as string[]
            },
            hookParams: { sortBy: 'date', sortOrder: 'desc' },
        },
        currentRow?.paddySaleDealNumber || undefined
    )

    const handleDealSelect = (dealId: string) => {
        form.setValue('paddySaleDealNumber', dealId)
        const sale = paddySaleDataRef.current.find(
            (p) => p.paddySalesDealNumber === dealId
        )
        if (sale) {
            if (sale.partyName) form.setValue('partyName', sale.partyName)
            if (sale.brokerName) form.setValue('brokerName', sale.brokerName)
            if (sale.dhanType) form.setValue('paddyType', sale.dhanType) // paddyType = dhanType
            if (sale.dhanQty) form.setValue('doQty', sale.dhanQty) // doQty = dhanQty from sales
            // Auto-fill gunny details if needed, mapping might depend on specific business logic or field availability
            // Assuming direct mapping if fields exist or leaving manual if divergent
        }
    }

    const createMutation = useCreatePrivatePaddyOutward(millId)
    const updateMutation = useUpdatePrivatePaddyOutward(millId)

    const form = useForm<PrivatePaddyOutward>({
        resolver: zodResolver(privatePaddyOutwardSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            paddySaleDealNumber: '',
            partyName: '',
            brokerName: '',
            paddyType: '',
            doQty: undefined,
            gunnyNew: undefined,
            gunnyOld: undefined,
            gunnyPlastic: undefined,
            juteWeight: undefined,
            plasticWeight: undefined,
            truckNumber: '',
            rstNumber: '',
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
                paddySaleDealNumber: '',
                partyName: '',
                brokerName: '',
                paddyType: '',
                doQty: undefined,
                gunnyNew: undefined,
                gunnyOld: undefined,
                gunnyPlastic: undefined,
                juteWeight: undefined,
                plasticWeight: undefined,
                truckNumber: '',
                rstNumber: '',
                truckWeight: undefined,
                gunnyWeight: undefined,
                netWeight: undefined,
            })
        }
    }, [currentRow, open, form])

    const onSubmit = async (data: PrivatePaddyOutward) => {
        try {
            const submissionData = {
                ...data,
                partyName: data.partyName || undefined,
                brokerName: data.brokerName || undefined,
            }

            if (isEditing && currentRow?._id) {
                toast.promise(
                    updateMutation.mutateAsync({
                        id: currentRow._id,
                        data: submissionData,
                    }),
                    {
                        loading: t('common.updating'),
                        success: () => {
                            setDialogOpen(null)
                            onOpenChange(false)
                            return t('common.success')
                        },
                        error: t('common.error'),
                    }
                )
            } else {
                toast.promise(createMutation.mutateAsync(submissionData), {
                    loading: t('common.adding'),
                    success: () => {
                        setDialogOpen(null)
                        onOpenChange(false)
                        return t('common.success')
                    },
                    error: t('common.error'),
                })
            }
        } catch {
            // Error is handled by mutation hooks
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t('privatePaddyOutward.editRecord')
                            : t('privatePaddyOutward.addRecord')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t('common.updateDetails')
                            : t('common.enterDetails')}
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
                                        <FormLabel>
                                            {t('privatePaddyOutward.form.date')}
                                        </FormLabel>
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
                                                            : t(
                                                                  'common.pickADate'
                                                              )}
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

                            {/* Sale Auto Number */}
                            <FormField
                                control={form.control}
                                name='paddySaleDealNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'privatePaddyOutward.form.paddySaleDealNumber'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <PaginatedCombobox
                                                value={field.value || ''}
                                                onValueChange={handleDealSelect}
                                                paginatedList={paddySaleDeal}
                                                placeholder={t(
                                                    'privatePaddyOutward.form.searchDeal'
                                                )}
                                                emptyText={t(
                                                    'common.noResults'
                                                )}
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
                                        <FormLabel>
                                            {t(
                                                'privatePaddyOutward.form.partyName'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'privatePaddyOutward.form.enterPartyName'
                                                )}
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
                                        <FormLabel>
                                            {t(
                                                'privatePaddyOutward.form.brokerName'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'privatePaddyOutward.form.enterBrokerName'
                                                )}
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Paddy Type */}
                            <FormField
                                control={form.control}
                                name='paddyType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'privatePaddyOutward.form.paddyType'
                                            )}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || undefined}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue
                                                        placeholder={t(
                                                            'common.selectType'
                                                        )}
                                                    />
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

                            {/* DO Qty */}
                            <FormField
                                control={form.control}
                                name='doQty'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'privatePaddyOutward.form.doQty'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.valueAsNumber
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

                            {/* Gunny New */}
                            <FormField
                                control={form.control}
                                name='gunnyNew'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'privatePaddyOutward.form.gunnyNew'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.valueAsNumber
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

                            {/* Gunny Old */}
                            <FormField
                                control={form.control}
                                name='gunnyOld'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'privatePaddyOutward.form.gunnyOld'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.valueAsNumber
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

                            {/*Gunny Plastic */}
                            <FormField
                                control={form.control}
                                name='gunnyPlastic'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'privatePaddyOutward.form.gunnyPlastic'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.valueAsNumber
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

                            {/* Jute Weight */}
                            <FormField
                                control={form.control}
                                name='juteWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'privatePaddyOutward.form.juteWeight'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.valueAsNumber
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

                            {/* Plastic Weight */}
                            <FormField
                                control={form.control}
                                name='plasticWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'privatePaddyOutward.form.plasticWeight'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.valueAsNumber
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

                            {/* Truck Number */}
                            <FormField
                                control={form.control}
                                name='truckNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'privatePaddyOutward.form.truckNumber'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'privatePaddyOutward.form.enterTruckNo'
                                                )}
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* RST Number */}
                            <FormField
                                control={form.control}
                                name='rstNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'privatePaddyOutward.form.rstNumber'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'privatePaddyOutward.form.enterRstNo'
                                                )}
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
                                        <FormLabel>
                                            {t(
                                                'privatePaddyOutward.form.truckWeight'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.valueAsNumber
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

                            {/* Gunny Weight - Calculated */}
                            <FormField
                                control={form.control}
                                name='gunnyWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'privatePaddyOutward.form.gunnyWeight'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.valueAsNumber
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

                            {/* Net Weight - Calculated */}
                            <FormField
                                control={form.control}
                                name='netWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'privatePaddyOutward.form.netWeight'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.valueAsNumber
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
                        </div>
                        <DialogFooter>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => onOpenChange(false)}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button type='submit'>
                                {isEditing
                                    ? t('common.update')
                                    : t('common.add')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
