import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePartyList } from '@/pages/mill-admin/input-reports/party-report/data/hooks'
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
import { useCreateFrkOutward, useUpdateFrkOutward } from '../data/hooks'
import { frkOutwardSchema, type FrkOutward } from '../data/schema'
import { useFrkOutward } from './frk-outward-provider'

type FrkOutwardActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function FrkOutwardActionDialog({
    open,
    onOpenChange,
}: FrkOutwardActionDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { millId, currentRow } = useFrkOutward()
    const party = usePaginatedList(
        millId || '',
        open,
        {
            useListHook: usePartyList,
            extractItems: (data) =>
                data.parties
                    .map((c) => c.partyName)
                    .filter(Boolean) as string[],
            hookParams: { sortBy: 'partyName', sortOrder: 'asc' },
        },
        currentRow?.partyName || undefined
    )
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const createMutation = useCreateFrkOutward()
    const updateMutation = useUpdateFrkOutward()

    const form = useForm<FrkOutward>({
        resolver: zodResolver(frkOutwardSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            partyName: '',
            gunnyPlastic: 0,
            plasticGunnyWeight: 0,
            truckNo: '',
            truckRst: '',
            truckWeight: 0,
            gunnyWeight: 0,
            netWeight: 0,
        },
    })

    useEffect(() => {
        if (open) {
            if (currentRow) {
                form.reset(currentRow)
            } else {
                form.reset({
                    date: format(new Date(), 'yyyy-MM-dd'),
                    partyName: '',
                    gunnyPlastic: 0,
                    plasticGunnyWeight: 0,
                    truckNo: '',
                    truckRst: '',
                    truckWeight: 0,
                    gunnyWeight: 0,
                    netWeight: 0,
                })
            }
        }
    }, [currentRow, form, open])

    const onSubmit = async (data: FrkOutward) => {
        try {
            const submissionData = {
                ...data,
                partyName: data.partyName || undefined,
            }

            if (isEditing && currentRow._id) {
                const { _id, ...updatePayload } = submissionData
                await updateMutation.mutateAsync({
                    millId,
                    id: currentRow._id,
                    payload: updatePayload,
                })
            } else {
                const { _id, ...createPayload } = submissionData
                await createMutation.mutateAsync({
                    millId,
                    payload: createPayload,
                })
            }
            onOpenChange(false)
        } catch (error) {
            // Error is handled by the mutation hooks
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t('outward.frkOutward.form.title', {
                                  context: 'edit',
                              })
                            : t('outward.frkOutward.form.title', {
                                  context: 'add',
                              })}
                    </DialogTitle>
                    <DialogDescription>
                        {t('outward.frkOutward.form.description')}
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
                                        <FormLabel>
                                            {t(
                                                'outward.frkOutward.form.fields.date'
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
                            <FormField
                                control={form.control}
                                name='partyName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.frkOutward.form.fields.partyName'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <PaginatedCombobox
                                                value={field.value || undefined}
                                                onValueChange={field.onChange}
                                                paginatedList={party}
                                                placeholder='Select party'
                                                emptyText={t(
                                                    'outward.frkOutward.form.fields.partyName.emptyText'
                                                )}
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
                                        <FormLabel>
                                            {t(
                                                'outward.frkOutward.form.fields.gunnyPlastic'
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
                            <FormField
                                control={form.control}
                                name='plasticGunnyWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.frkOutward.form.fields.plasticGunnyWeight'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter quantity'
                                                type='number'
                                                step='0.001'
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
                            <FormField
                                control={form.control}
                                name='truckNo'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.frkOutward.form.fields.truckNo'
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
                            <FormField
                                control={form.control}
                                name='truckRst'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.frkOutward.form.fields.truckRst'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter RST number'
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
                                name='truckWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.frkOutward.form.fields.truckWeight'
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
                            <FormField
                                control={form.control}
                                name='gunnyWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.frkOutward.form.fields.gunnyWeight'
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
                            <FormField
                                control={form.control}
                                name='netWeight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'outward.frkOutward.form.fields.netWeight'
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
                            <Button
                                type='submit'
                                disabled={
                                    createMutation.isPending ||
                                    updateMutation.isPending
                                }
                            >
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
