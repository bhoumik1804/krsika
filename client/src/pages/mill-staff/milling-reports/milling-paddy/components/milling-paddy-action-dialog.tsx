import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { paddyTypeOptions, riceTypeOptions } from '@/constants/purchase-form'
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
import { useCreateMillingPaddy, useUpdateMillingPaddy } from '../data/hooks'
import { millingPaddySchema, type MillingPaddy } from '../data/schema'

type MillingPaddyActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: MillingPaddy | null
}

export function MillingPaddyActionDialog({
    open,
    onOpenChange,
    currentRow,
}: MillingPaddyActionDialogProps) {
    const { millId } = useParams<{ millId: string }>()
    const { t } = useTranslation('mill-staff')
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const createMutation = useCreateMillingPaddy(millId || '')
    const updateMutation = useUpdateMillingPaddy(millId || '')

    const form = useForm<MillingPaddy>({
        resolver: zodResolver(millingPaddySchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            paddyType: '',
            hopperInGunny: undefined,
            hopperInQintal: undefined,
            riceType: '',
            riceQuantity: undefined,
            ricePercentage: undefined,
            khandaQuantity: undefined,
            khandaPercentage: undefined,
            kodhaQuantity: undefined,
            kodhaPercentage: undefined,
            bhusaTon: undefined,
            bhusaPercentage: undefined,
            nakkhiQuantity: undefined,
            nakkhiPercentage: undefined,
            wastagePercentage: undefined,
        },
    })

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset({
                date: format(new Date(), 'yyyy-MM-dd'),
                paddyType: '',
                // Reset other fields to undefined/defaults
            })
        }
    }, [currentRow, form, open])

    const onSubmit = (data: MillingPaddy) => {
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
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? t('common.edit') : t('common.add')}{' '}
                        {t('millingReports.paddy.form.title')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? t('common.update') : t('common.enter')}{' '}
                        {t('common.updateDetails')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <FormField
                                control={form.control}
                                name='date'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'millingReports.paddy.form.fields.date'
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
                                                            : t(
                                                                  'common.pickDate'
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
                            <FormField
                                control={form.control}
                                name='paddyType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'millingReports.paddy.form.fields.paddyType'
                                            )}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select paddy type' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='w-full'>
                                                {paddyTypeOptions.map(
                                                    (type) => (
                                                        <SelectItem
                                                            key={type.value}
                                                            value={type.value}
                                                        >
                                                            {type.label}
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
                                name='hopperInGunny'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'millingReports.paddy.form.fields.hopperInGunny'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='hopperInQintal'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'millingReports.paddy.form.fields.hopperInQintal'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='riceType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'millingReports.paddy.form.fields.riceType'
                                            )}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select rice type' />
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
                            <FormField
                                control={form.control}
                                name='riceQuantity'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'millingReports.paddy.form.fields.riceQuantity'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='ricePercentage'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'millingReports.paddy.form.fields.ricePercentage'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='khandaQuantity'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'millingReports.paddy.form.fields.khandaQuantity'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='khandaPercentage'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'millingReports.paddy.form.fields.khandaPercentage'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='kodhaQuantity'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'millingReports.paddy.form.fields.kodhaQuantity'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='kodhaPercentage'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'millingReports.paddy.form.fields.kodhaPercentage'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='bhusaTon'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'millingReports.paddy.form.fields.bhusaTon'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='bhusaPercentage'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'millingReports.paddy.form.fields.bhusaPercentage'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='nakkhiQuantity'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'millingReports.paddy.form.fields.nakkhiQuantity'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='nakkhiPercentage'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'millingReports.paddy.form.fields.nakkhiPercentage'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                                name='wastagePercentage'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'millingReports.paddy.form.fields.wastagePercentage'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        Number.isNaN(val)
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
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button type='submit'>
                                {t(isEditing ? 'common.update' : 'common.add')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
