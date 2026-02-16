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
import { inwardSchema, type InwardEntry } from '../data/schema'

type InwardsActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: InwardEntry | null
}

export function InwardsActionDialog({
    open,
    onOpenChange,
    currentRow,
}: InwardsActionDialogProps) {
    const { t } = useTranslation('mill-staff')
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const form = useForm<InwardEntry>({
        resolver: zodResolver(inwardSchema),
        defaultValues: {
            date: '',
            gatePassNumber: '',
            partyName: '',
            item: '',
            vehicleNumber: '',
            bags: 0,
            weight: 0,
            driverName: '',
            status: 'pending',
            remarks: '',
        },
    })

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset({
                date: new Date().toISOString().split('T')[0],
                status: 'pending',
                gatePassNumber: `GP-${Math.floor(Math.random() * 9000 + 1000)}`, // Simple auto-gen
            })
        }
    }, [currentRow, form])

    const onSubmit = () => {
        toast.promise(sleep(2000), {
            loading: isEditing ? t('inwards.updating') : t('inwards.adding'),
            success: () => {
                onOpenChange(false)
                form.reset()
                return isEditing
                    ? t('inwards.updatedSuccess')
                    : t('inwards.addedSuccess')
            },
            error: isEditing
                ? t('inwards.updateFailed')
                : t('inwards.addFailed'),
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? t('common.edit') : t('common.add')}{' '}
                        {t('inwards.title')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? t('common.update') : t('common.add')}{' '}
                        {t('common.gatePass')}
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
                                name='gatePassNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('common.gatePass')} No.
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'inwards.gatePassPlaceholder'
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
                                name='partyName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('common.partyName')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'inwards.partyPlaceholder'
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
                                name='item'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('common.item')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'inwards.itemPlaceholder'
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
                                name='vehicleNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('common.vehicleNo')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'inwards.vehiclePlaceholder'
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
                                name='driverName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('common.driverName')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'inwards.driverPlaceholder'
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
                                name='bags'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            No. of {t('common.bags')}
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
                                name='weight'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('common.netWeight')}
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
                                                <SelectItem value='pending'>
                                                    {t('common.pending')}
                                                </SelectItem>
                                                <SelectItem value='completed'>
                                                    {t('common.completed')}
                                                </SelectItem>
                                                <SelectItem value='verified'>
                                                    {t('common.verified')}
                                                </SelectItem>
                                                <SelectItem value='rejected'>
                                                    {t('common.rejected')}
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
                                                'inwards.remarksPlaceholder'
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
                                {t('common.gatePass')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

