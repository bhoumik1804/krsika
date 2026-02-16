import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBrokerList } from '@/pages/mill-admin/input-reports/broker-report/data/hooks'
import { usePartyList } from '@/pages/mill-admin/input-reports/party-report/data/hooks'
import { CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { purchaseDealTypes } from '@/constants/purchase-form'
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
    useCreateFinancialReceipt,
    useUpdateFinancialReceipt,
} from '../data/hooks'
import { FinancialReceiptSchema, type FinancialReceipt } from '../data/schema'

type FinancialReceiptActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: FinancialReceipt | null
}

export function FinancialReceiptActionDialog({
    open,
    onOpenChange,
    currentRow,
}: FinancialReceiptActionDialogProps) {
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
    const isEditing = !!currentRow
    const [datePopoverOpen, setDatePopoverOpen] = useState(false)

    const form = useForm<FinancialReceipt>({
        resolver: zodResolver(FinancialReceiptSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            partyName: '',
            brokerName: '',
            salesDealType: '',
            salesDealNumber: '',
            receivedAmount: '' as unknown as number,
            remarks: '',
        },
    })

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset()
        }
    }, [currentRow, form])

    const createMutation = useCreateFinancialReceipt()
    const updateMutation = useUpdateFinancialReceipt()

    const onSubmit = (data: FinancialReceipt) => {
        // Sanitize data
        const submissionData = {
            ...data,
            partyName: data.partyName || undefined,
            brokerName: data.brokerName || undefined,
            salesDealType: data.salesDealType || undefined,
        }

        if (isEditing && currentRow._id) {
            updateMutation.mutate(
                {
                    millId: millId || '',
                    data: { ...submissionData, id: currentRow._id },
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
                    data: submissionData,
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
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t('financialReceipt.form.editTitle')
                            : t('financialReceipt.form.addTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t('financialReceipt.form.editDescription')
                            : t('financialReceipt.form.addDescription')}
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
                                            {t('financialReceipt.form.date')}
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
                                                                  'financialReceipt.form.placeholders.date'
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
                                            {t(
                                                'financialReceipt.form.partyName'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <PaginatedCombobox
                                                value={field.value ?? undefined}
                                                onValueChange={field.onChange}
                                                paginatedList={party}
                                                placeholder={t(
                                                    'financialReceipt.form.placeholders.party'
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
                            <FormField
                                control={form.control}
                                name='brokerName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'financialReceipt.form.brokerName'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <PaginatedCombobox
                                                value={field.value ?? undefined}
                                                onValueChange={field.onChange}
                                                paginatedList={broker}
                                                placeholder={t(
                                                    'financialReceipt.form.placeholders.broker'
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
                            <FormField
                                control={form.control}
                                name='salesDealType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'financialReceipt.form.dealType'
                                            )}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || ''}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue
                                                        placeholder={t(
                                                            'financialReceipt.form.placeholders.dealType'
                                                        )}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='w-full'>
                                                {purchaseDealTypes.map(
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
                                name='salesDealNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'financialReceipt.form.dealNumber'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'financialReceipt.form.placeholders.dealNumber'
                                                )}
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
                                name='receivedAmount'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'financialReceipt.form.receivedAmount'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                placeholder='0.00'
                                                {...field}
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
                                name='remarks'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('financialReceipt.form.remarks')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'financialReceipt.form.placeholders.remarks'
                                                )}
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
                                    : t('common.add')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
