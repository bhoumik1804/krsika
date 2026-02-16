import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
import { millingSchema, type MillingEntry } from '../data/schema'

type MillingActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: MillingEntry | null
}

export function MillingActionDialog({
    open,
    onOpenChange,
    currentRow,
}: MillingActionDialogProps) {
    const { t } = useTranslation('mill-staff')
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const form = useForm<MillingEntry>({
        resolver: zodResolver(millingSchema),
        defaultValues: {
            date: '',
            shift: 'Day',
            paddyType: '',
            paddyQuantity: 0,
            riceYield: 0,
            brokenYield: 0,
            branYield: 0,
            huskYield: 0,
            status: 'scheduled',
            remarks: '',
        },
    })

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset({
                date: new Date().toISOString().split('T')[0],
                shift: 'Day',
                status: 'scheduled',
            })
        }
    }, [currentRow, form])

    const onSubmit = () => {
        toast.promise(sleep(2000), {
            loading: isEditing ? t('milling.updating') : t('milling.adding'),
            success: () => {
                onOpenChange(false)
                form.reset()
                return isEditing
                    ? t('milling.updatedSuccess')
                    : t('milling.addedSuccess')
            },
            error: isEditing
                ? t('milling.updateFailed')
                : t('milling.addFailed'),
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? t('common.edit') : t('common.add')}{' '}
                        {t('milling.title')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? t('common.update') : t('common.add')}{' '}
                        {t('milling.title')}
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
                                            {t('common.date')}
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
                            <FormField
                                control={form.control}
                                name='shift'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('common.shift')}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={t(
                                                            'common.select'
                                                        )}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='Day'>
                                                    {t('common.day')}
                                                </SelectItem>
                                                <SelectItem value='Night'>
                                                    {t('common.night')}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                            {t('common.paddyType')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'milling.paddyTypePlaceholder'
                                                )}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='paddyQuantity'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('common.paddyQuantity')}
                                        </FormLabel>
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
                            <FormField
                                control={form.control}
                                name='riceYield'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('common.riceYield')}
                                        </FormLabel>
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
                            <FormField
                                control={form.control}
                                name='brokenYield'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('common.brokenRice')}
                                        </FormLabel>
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
                            <FormField
                                control={form.control}
                                name='branYield'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('common.branYield')}
                                        </FormLabel>
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
                            <FormField
                                control={form.control}
                                name='huskYield'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('common.huskYield')}
                                        </FormLabel>
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
                            <FormField
                                control={form.control}
                                name='status'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('common.status')}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={t(
                                                            'common.select'
                                                        )}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='scheduled'>
                                                    {t('common.scheduled')}
                                                </SelectItem>
                                                <SelectItem value='in-progress'>
                                                    {t('common.in-progress')}
                                                </SelectItem>
                                                <SelectItem value='completed'>
                                                    {t('common.completed')}
                                                </SelectItem>
                                                <SelectItem value='halted'>
                                                    {t('common.halted')}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name='remarks'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('common.remarks')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t(
                                                'milling.remarksPlaceholder'
                                            )}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                    : t('common.add')}{' '}
                                {t('common.entry')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

