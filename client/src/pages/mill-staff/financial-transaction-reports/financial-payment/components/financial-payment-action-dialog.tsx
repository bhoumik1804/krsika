import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBrokerList } from '@/pages/mill-admin/input-reports/broker-report/data/hooks'
import { useLabourGroupList } from '@/pages/mill-admin/input-reports/labour-group-report/data/hooks'
import { usePartyList } from '@/pages/mill-admin/input-reports/party-report/data/hooks'
import { useStaffList } from '@/pages/mill-admin/input-reports/staff-report/data/hooks'
import { useTransporterList } from '@/pages/mill-admin/input-reports/transporter-report/data/hooks'
import { CalendarIcon } from 'lucide-react'
import { useParams } from 'react-router'
import {
    paymentTypeOptions,
    labourTypeOptions,
    purchaseDealTypes,
    monthOptions,
} from '@/constants/purchase-form'
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
    useCreateFinancialPayment,
    useUpdateFinancialPayment,
} from '../data/hooks'
import { FinancialPaymentSchema, type FinancialPayment } from '../data/schema'
import { type CreateFinancialPaymentRequest } from '../data/types'

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
    const { t } = useTranslation('mill-staff')
    const { millId } = useParams<{ millId: string }>()
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
        currentRow?.partyName ?? undefined
    )

    const broker = usePaginatedList(
        millId || '',
        open,
        {
            useListHook: useBrokerList,
            extractItems: (data) =>
                data.brokers
                    .map((c) => c.brokerName)
                    .filter(Boolean) as string[],
        },
        currentRow?.brokerName ?? undefined
    )

    const transporter = usePaginatedList(
        millId || '',
        open,
        {
            useListHook: (params) => useTransporterList(params),
            extractItems: (data) =>
                data.transporters?.map((t) => t.transporterName) || [],
            hookParams: { sortBy: 'transporterName', sortOrder: 'asc' },
        },
        currentRow?.transporterName ?? undefined
    )

    const labourGroup = usePaginatedList(
        millId || '',
        open,
        {
            useListHook: (params) => useLabourGroupList(params.millId, params),
            extractItems: (data) =>
                data.labourGroups?.map((lg) => lg.labourTeamName) || [],
            hookParams: { sortBy: 'labourTeamName', sortOrder: 'asc' },
        },
        currentRow?.labourGroupName ?? undefined
    )

    const staffList = usePaginatedList(
        millId || '',
        open,
        {
            useListHook: (params) => useStaffList(params),
            extractItems: (data) => data.staff?.map((s) => s.fullName) || [],
            hookParams: { sortBy: 'fullName', sortOrder: 'asc' },
        },
        currentRow?.staffName ?? undefined
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

    // Auto-populate salary (Note: This is a simplified logic, real implementation might need a detail fetch)
    useEffect(() => {
        if (staffName && paymentType === 'वेतन / एडवांस भुगतान') {
            // We might need to fetch the specific staff details to get the salary
            // For now keeping it logic empty or fetch from list if possible
        }
    }, [staffName, paymentType, form])

    // Calculate payable salary
    useEffect(() => {
        if (
            paymentType === 'वेतन / एडवांस भुगतान' &&
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

    const createMutation = useCreateFinancialPayment()
    const updateMutation = useUpdateFinancialPayment()

    const onSubmit = (data: FinancialPayment) => {
        // Sanitize data - remove system fields and empty strings
        const sanitizedData = Object.fromEntries(
            Object.entries(data)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .filter(([key, value]) => {
                    if (key === '_id' || key === 'id') return false
                    if (value === '' || value === null) return false
                    return true
                })
        ) as unknown as CreateFinancialPaymentRequest

        console.log('Final Submission Data:', sanitizedData)

        if (isEditing && currentRow._id) {
            updateMutation.mutate(
                {
                    millId: millId || '',
                    data: { ...sanitizedData, id: currentRow._id },
                },
                {
                    onSuccess: () => {
                        onOpenChange(false)
                        form.reset()
                    },
                }
            )
        } else {
            createMutation.mutate(
                {
                    millId: millId || '',
                    data: sanitizedData,
                },
                {
                    onSuccess: () => {
                        onOpenChange(false)
                        form.reset()
                    },
                }
            )
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-3xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? t('common.edit') : t('common.add')} {t('financialTransactionReports.payment.form.title')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? t('common.update') : t('common.enter')} {t('financialTransactionReports.payment.form.description')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit, (errors) => {
                            console.error('Form Validation Errors:', errors)
                        })}
                        className='space-y-4'
                    >
                        <div className='grid grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name='date'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('financialTransactionReports.payment.form.fields.date')}</FormLabel>
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
                                        <FormLabel>{t('financialTransactionReports.payment.form.fields.paymentType')}</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ''}
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
                                            <FormLabel>{t('financialTransactionReports.payment.form.fields.partyName')}</FormLabel>
                                            <FormControl>
                                                <PaginatedCombobox
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    paginatedList={party}
                                                    placeholder='Search party...'
                                                    emptyText='No parties found'
                                                />
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
                                            <FormLabel>{t('financialTransactionReports.payment.form.fields.brokerName')}</FormLabel>
                                            <FormControl>
                                                <PaginatedCombobox
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    paginatedList={broker}
                                                    placeholder='Search broker...'
                                                    emptyText='No brokers found'
                                                />
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
                                            <FormLabel>{t('financialTransactionReports.payment.form.fields.purchaseDealType')}</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || ''}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select deal type' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className='w-full'>
                                                    {purchaseDealTypes.map(
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
                                            <FormLabel>{t('financialTransactionReports.payment.form.fields.purchaseDealNumber')}</FormLabel>
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
                                                {t('financialTransactionReports.payment.form.fields.transporterName')}
                                            </FormLabel>
                                            <FormControl>
                                                <PaginatedCombobox
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    paginatedList={transporter}
                                                    placeholder='Search transporter...'
                                                    emptyText='No transporters found'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='truckNumber'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('financialTransactionReports.payment.form.fields.truckNumber')}</FormLabel>
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
                                            <FormLabel>{t('financialTransactionReports.payment.form.fields.diesel')}</FormLabel>
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
                                            <FormLabel>{t('financialTransactionReports.payment.form.fields.bhatta')}</FormLabel>
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
                                                {t('financialTransactionReports.payment.form.fields.repairOrMaintenance')}
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
                                            <FormLabel>{t('financialTransactionReports.payment.form.fields.labourType')}</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || ''}
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
                                                {t('financialTransactionReports.payment.form.fields.labourGroupName')}
                                            </FormLabel>
                                            <FormControl>
                                                <PaginatedCombobox
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    paginatedList={labourGroup}
                                                    placeholder='Search labour group...'
                                                    emptyText='No labour groups found'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {paymentType === 'वेतन / एडवांस भुगतान' && (
                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='staffName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('financialTransactionReports.payment.form.fields.staffName')}</FormLabel>
                                            <FormControl>
                                                <PaginatedCombobox
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    paginatedList={staffList}
                                                    placeholder='Search staff...'
                                                    emptyText='No staff found'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='salary'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('financialTransactionReports.payment.form.fields.salary')}</FormLabel>
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
                                            <FormLabel>{t('financialTransactionReports.payment.form.fields.month')}</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || ''}
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
                                            <FormLabel>{t('financialTransactionReports.payment.form.fields.attendance')}</FormLabel>
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
                                            <FormLabel>{t('financialTransactionReports.payment.form.fields.allowedLeave')}</FormLabel>
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
                                                {t('financialTransactionReports.payment.form.fields.payableSalary')}
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
                                                {t('financialTransactionReports.payment.form.fields.salaryPayment')}
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
                                                {t('financialTransactionReports.payment.form.fields.advancePayment')}
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
                                        <FormLabel>{t('financialTransactionReports.payment.form.fields.paymentAmount')}</FormLabel>
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
                                    <FormLabel>{t('financialTransactionReports.payment.form.fields.remarks')}</FormLabel>
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
