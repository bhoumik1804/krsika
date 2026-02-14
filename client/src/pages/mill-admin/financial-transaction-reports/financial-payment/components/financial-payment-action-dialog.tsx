import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { paymentTypeOptions } from '@/constants/purchase-form'
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
import { FinancialPaymentSchema, type FinancialPayment } from '../data/schema'
import { useParams } from 'react-router'
import { usePartyBrokerSelection } from '@/hooks/use-party-broker-selection'
import { Combobox, ComboboxInput, ComboboxContent, ComboboxItem, ComboboxList, ComboboxEmpty, ComboboxCollection } from '@/components/ui/combobox'

const dealTypeOptions = [
    { label: 'खरीद', value: 'खरीद' },
    { label: 'बिक्री', value: 'बिक्री' },
    { label: 'विनिमय', value: 'विनिमय' },
]

const transporterOptions = [
    { label: 'सिंह ट्रांसपोर्ट', value: 'सिंह ट्रांसपोर्ट' },
    { label: 'गुप्ता लॉजिस्टिक्स', value: 'गुप्ता लॉजिस्टिक्स' },
]

const labourTypeOptions = [
    { label: 'आढ़क हमाली', value: 'आढ़क हमाली' },
    { label: 'आवक हमाली', value: 'आवक हमाली' },
]

const labourGroupOptions = [
    { label: 'राम हमाल', value: 'राम हमाल' },
    { label: 'श्याम ग्रुप', value: 'श्याम ग्रुप' },
]

const staffOptions = [
    { label: 'रमेश कुमार', value: 'रमेश कुमार', salary: 25000 },
    { label: 'सुरेश पटेल', value: 'सुरेश पटेल', salary: 30000 },
]

const monthOptions = [
    { label: 'जनवरी', value: 'जनवरी', days: 31 },
    { label: 'फरवरी', value: 'फरवरी', days: 28 },
]

type FinancialPaymentActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: FinancialPayment | null
}

export function FinancialPaymentActionDialog({
    open,
    onOpenChange,
    currentRow,
}: FinancialPaymentActionDialogProps) {
    const { millId } = useParams<{ millId: string }>()
    const { party, broker } = usePartyBrokerSelection(
        millId || '',
        open,
        currentRow?.partyName || undefined,
        currentRow?.brokerName || undefined
    )
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const form = useForm<FinancialPayment>({
        resolver: zodResolver(FinancialPaymentSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            paymentType: '',
            partyName: '',
            brokerName: '',
            purchaseDealType: '',
            purchaseDealNumber: '',
            transporterName: '',
            truckNumber: '',
            diesel: undefined,
            bhatta: undefined,
            repairOrMaintenance: undefined,
            labourType: '',
            labourGroupName: '',
            staffName: '',
            salary: undefined,
            month: '',
            attendance: undefined,
            allowedLeave: undefined,
            payableSalary: undefined,
            salaryPayment: undefined,
            advancePayment: undefined,
            paymentAmount: undefined,
            remarks: '',
        },
    })

    const paymentType = form.watch('paymentType')
    const staffName = form.watch('staffName')
    const month = form.watch('month')
    const attendance = form.watch('attendance')
    const salary = form.watch('salary')
    const allowedLeave = form.watch('allowedLeave')

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset()
        }
    }, [currentRow, form])

    // Auto-populate salary
    useEffect(() => {
        if (staffName && paymentType === 'वेतन/मजदूरी भुगतान') {
            const staff = staffOptions.find((s) => s.value === staffName)
            if (staff) {
                form.setValue('salary', staff.salary)
            }
        }
    }, [staffName, paymentType, form])

    // Calculate payable salary
    useEffect(() => {
        if (
            paymentType === 'वेतन/मजदूरी भुगतान' &&
            salary &&
            attendance &&
            month &&
            allowedLeave !== undefined
        ) {
            const selectedMonth = monthOptions.find((m) => m.value === month)
            if (selectedMonth) {
                const payable =
                    ((attendance + (allowedLeave || 0)) / selectedMonth.days) *
                    salary
                form.setValue('payableSalary', Number(payable.toFixed(2)))
            }
        }
    }, [salary, attendance, month, allowedLeave, paymentType, form])

    const onSubmit = (data: FinancialPayment) => {
        // Sanitize data
        const submissionData = {
            ...data,
            partyName: data.partyName || undefined,
            brokerName: data.brokerName || undefined,
            paymentType: data.paymentType || undefined,
            purchaseDealType: data.purchaseDealType || undefined,
            transporterName: data.transporterName || undefined,
            labourType: data.labourType || undefined,
            labourGroupName: data.labourGroupName || undefined,
            staffName: data.staffName || undefined,
            month: data.month || undefined,
        }

        console.log('Submitting:', submissionData)

        toast.promise(sleep(2000), {
            loading: isEditing ? 'Updating...' : 'Adding...',
            success: () => {
                onOpenChange(false)
                form.reset()
                return isEditing ? 'Updated successfully' : 'Added successfully'
            },
            error: isEditing ? 'Failed to update' : 'Failed to add',
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-3xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit' : 'Add'} Payment Record
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update' : 'Enter'} payment details
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
                                name='paymentType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || ''}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='w-full'>
                                                {paymentTypeOptions.map(
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
                        </div>

                        {/* Conditional Fields Based on Payment Type */}
                        {paymentType === 'सौदे का भुगतान' && (
                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='partyName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Party Name</FormLabel>
                                            <FormControl>
                                                <Combobox
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    items={party.items}
                                                >
                                                    <ComboboxInput
                                                        placeholder='Search party...'
                                                        showClear
                                                    />
                                                    <ComboboxContent>
                                                        <ComboboxList onScroll={party.onScroll}>
                                                            <ComboboxCollection>
                                                                {(p) => (
                                                                    <ComboboxItem value={p}>
                                                                        {p}
                                                                    </ComboboxItem>
                                                                )}
                                                            </ComboboxCollection>
                                                            <ComboboxEmpty>
                                                                No parties found
                                                            </ComboboxEmpty>
                                                            {party.isLoadingMore && (
                                                                <div className='py-2 text-center text-xs text-muted-foreground'>
                                                                    Loading more...
                                                                </div>
                                                            )}
                                                        </ComboboxList>
                                                    </ComboboxContent>
                                                </Combobox>
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
                                                <Combobox
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    items={broker.items}
                                                >
                                                    <ComboboxInput
                                                        placeholder='Search broker...'
                                                        showClear
                                                    />
                                                    <ComboboxContent>
                                                        <ComboboxList onScroll={broker.onScroll}>
                                                            <ComboboxCollection>
                                                                {(b) => (
                                                                    <ComboboxItem value={b}>
                                                                        {b}
                                                                    </ComboboxItem>
                                                                )}
                                                            </ComboboxCollection>
                                                            <ComboboxEmpty>
                                                                No brokers found
                                                            </ComboboxEmpty>
                                                            {broker.isLoadingMore && (
                                                                <div className='py-2 text-center text-xs text-muted-foreground'>
                                                                    Loading more...
                                                                </div>
                                                            )}
                                                        </ComboboxList>
                                                    </ComboboxContent>
                                                </Combobox>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='purchaseDealType'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Deal Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || ''}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {dealTypeOptions.map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
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
                                    name='purchaseDealNumber'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Deal Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {paymentType === 'परिवहन भुगतान' && (
                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='transporterName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Transporter Name
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || ''}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {transporterOptions.map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
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
                                    name='truckNumber'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Truck Number</FormLabel>
                                            <FormControl>
                                                <Input
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
                                    name='diesel'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Diesel</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value
                                                                ? parseFloat(
                                                                    e.target
                                                                        .value
                                                                )
                                                                : undefined
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
                                    name='bhatta'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bhatta</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value
                                                                ? parseFloat(
                                                                    e.target
                                                                        .value
                                                                )
                                                                : undefined
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
                                    name='repairOrMaintenance'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Repair/Maintenance
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value
                                                                ? parseFloat(
                                                                    e.target
                                                                        .value
                                                                )
                                                                : undefined
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {paymentType === 'हमाली भुगतान' && (
                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='labourType'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Labour Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || ''}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {labourTypeOptions.map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
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
                                            <FormLabel>
                                                Labour Group Name
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || ''}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {labourGroupOptions.map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
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
                            </div>
                        )}

                        {paymentType === 'वेतन/मजदूरी भुगतान' && (
                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='staffName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Staff Name</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || ''}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {staffOptions.map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
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
                                    name='salary'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Salary</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    disabled
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
                                    name='month'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Month</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || ''}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {monthOptions.map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
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
                                    name='attendance'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Attendance</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value
                                                                ? parseInt(
                                                                    e.target
                                                                        .value
                                                                )
                                                                : undefined
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
                                    name='allowedLeave'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Allowed Leave</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value
                                                                ? parseFloat(
                                                                    e.target
                                                                        .value
                                                                )
                                                                : undefined
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
                                    name='payableSalary'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Payable Salary
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    disabled
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
                                    name='salaryPayment'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Salary Payment
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value
                                                                ? parseFloat(
                                                                    e.target
                                                                        .value
                                                                )
                                                                : undefined
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
                                    name='advancePayment'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Advance Payment
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value
                                                                ? parseFloat(
                                                                    e.target
                                                                        .value
                                                                )
                                                                : undefined
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {/* Payment Amount - Common Field */}
                        {paymentType && (
                            <FormField
                                control={form.control}
                                name='paymentAmount'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value
                                                            ? parseFloat(
                                                                e.target.value
                                                            )
                                                            : undefined
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Remarks Field */}
                        <FormField
                            control={form.control}
                            name='remarks'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Remarks</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value || ''}
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
