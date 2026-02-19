import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCommitteeList } from '@/pages/mill-admin/input-reports/committee-report/data/hooks'
import { CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
    useCreateGovtGunnyOutward,
    useUpdateGovtGunnyOutward,
} from '../data/hooks'
import { GovtGunnyOutwardSchema, type GovtGunnyOutward } from '../data/schema'
import { useGovtGunnyOutward } from './govt-gunny-outward-provider'

type GovtGunnyOutwardActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: GovtGunnyOutward | null
}

export function GovtGunnyOutwardActionDialog({
    open,
    onOpenChange,
    currentRow,
}: GovtGunnyOutwardActionDialogProps) {
    const isEditing = !!currentRow
    const { t } = useTranslation('mill-staff')
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)
    const { millId, setOpen: setDialogOpen } = useGovtGunnyOutward()
    const committee = usePaginatedList(
        millId || '',
        open,
        {
            useListHook: useCommitteeList,
            extractItems: (data) =>
                data.committees
                    .map((c: any) => c.committeeName)
                    .filter(Boolean) as string[],
            hookParams: { sortBy: 'committeeName', sortOrder: 'asc' },
        },
        currentRow?.samitiSangrahan || undefined
    )
    const createMutation = useCreateGovtGunnyOutward(millId)
    const updateMutation = useUpdateGovtGunnyOutward(millId)

    const form = useForm<GovtGunnyOutward>({
        resolver: zodResolver(GovtGunnyOutwardSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            gunnyDmNumber: '',
            samitiSangrahan: '',
            oldGunnyQty: undefined,
            plasticGunnyQty: undefined,
            truckNo: '',
        },
    })

    useEffect(() => {
        if (!open) return

        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset({
                date: format(new Date(), 'yyyy-MM-dd'),
                gunnyDmNumber: '',
                samitiSangrahan: '',
                oldGunnyQty: undefined,
                plasticGunnyQty: undefined,
                truckNo: '',
            })
        }
    }, [currentRow, form, open])

    const onSubmit = async (data: GovtGunnyOutward) => {
        try {
            if (isEditing && currentRow?._id) {
                await updateMutation.mutateAsync({
                    id: currentRow._id,
                    data,
                })
            } else {
                await createMutation.mutateAsync(data)
            }
            setDialogOpen(null)
            onOpenChange(false)
            form.reset()
        } catch {
            // Error is handled by mutation hooks
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-xl'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t('outward.govtGunnyOutward.form.title', {
                                  context: 'edit',
                              })
                            : t('outward.govtGunnyOutward.form.title', {
                                  context: 'add',
                              })}
                    </DialogTitle>
                    <DialogDescription>
                        {t('outward.govtGunnyOutward.form.description')}
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
                                            {t(
                                                'outward.govtGunnyOutward.form.fields.date'
                                            )}
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
                                                            : 'Select Date'}
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

                            {/* Gunny DM */}
                            <FormField
                                control={form.control}
                                name='gunnyDmNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.govtGunnyOutward.form.fields.gunnyDmNumber'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter gunny DM number'
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Samiti Sangrahan */}
                            <FormField
                                control={form.control}
                                name='samitiSangrahan'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.govtGunnyOutward.form.fields.samitiSangrahan'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <PaginatedCombobox
                                                value={field.value || ''}
                                                onValueChange={field.onChange}
                                                paginatedList={committee}
                                                placeholder='Select samiti/sangrahan'
                                                emptyText={t(
                                                    'common.noResults'
                                                )}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Old Gunny Qty */}
                            <FormField
                                control={form.control}
                                name='oldGunnyQty'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.govtGunnyOutward.form.fields.oldGunnyQty'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter quantity'
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

                            {/* Plastic Gunny Qty */}
                            <FormField
                                control={form.control}
                                name='plasticGunnyQty'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.govtGunnyOutward.form.fields.plasticGunnyQty'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter quantity'
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
                            {/* Truck No */}
                            <FormField
                                control={form.control}
                                name='truckNo'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.govtGunnyOutward.form.fields.truckNo'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter truck number'
                                                {...field}
                                                value={field.value || ''}
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
                                    : t(
                                          'outward.govtGunnyOutward.form.primaryButton'
                                      )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
