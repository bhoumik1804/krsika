import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLabourGroupList } from '@/pages/mill-admin/input-reports/labour-group-report/data/hooks'
import { CalendarIcon } from 'lucide-react'
import { useParams } from 'react-router'
import { labourTypeOptions } from '@/constants/purchase-form'
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
import { Textarea } from '@/components/ui/textarea'
import { useCreateLabourOther, useUpdateLabourOther } from '../data/hooks'
import { labourOtherSchema, type LabourOther } from '../data/schema'

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
    const { millId } = useParams<{ millId: string }>()
    const { t } = useTranslation('mill-staff')
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const createMutation = useCreateLabourOther(millId || '')
    const updateMutation = useUpdateLabourOther(millId || '')

    const labourGroupList = usePaginatedList(
        millId || '',
        open,
        {
            useListHook: (params) => useLabourGroupList(params.millId, params),
            extractItems: (data) =>
                data.labourGroups?.map((lg) => lg.labourTeamName) || [],
            hookParams: { sortBy: 'labourTeamName', sortOrder: 'asc' },
        },
        currentRow?.labourGroupName
    )

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
            form.reset({
                date: format(new Date(), 'yyyy-MM-dd'),
                // other defaults
            })
        }
    }, [currentRow, form, open])

    const labourType = form.watch('labourType')
    const isOtherType = labourType === labourTypeOptions[3].value

    const onSubmit = (data: LabourOther) => {
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
                        {isEditing ? t('common.edit') : t('common.add')} {t('labourCostReports.other.form.title').split('आवक')[1]?.trim() || 'Record'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? t('common.update') : t('common.enter')} {t('common.updateDetails')}
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
                                        <FormLabel>{t('labourCostReports.other.form.fields.date')}</FormLabel>
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
                                                            : t('common.pickDate')}
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
                                        <FormLabel>{t('labourCostReports.other.form.fields.hamaliType')}</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || ''}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select labour type' />
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
                                        <FormLabel>{t('labourCostReports.other.form.fields.hamalRejaToliName')}</FormLabel>
                                        <FormControl>
                                            <PaginatedCombobox
                                                value={field.value || ''}
                                                onValueChange={field.onChange}
                                                paginatedList={labourGroupList}
                                                placeholder='select labour group name'
                                            />
                                        </FormControl>
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
                                                    {t('labourCostReports.other.form.fields.gunnyCount')}
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
                                                    {t('labourCostReports.other.form.fields.hamaliRate')}
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
                                                    {t('labourCostReports.other.form.fields.workDetail')}
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
                                                    {t('labourCostReports.other.form.fields.totalAmount')}
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
                                {t('common.cancel')}
                            </Button>
                            <Button type='submit'>
                                {isEditing ? t('common.update') : t('common.add')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
