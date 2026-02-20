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
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    useCreateDoReport,
    useUpdateDoReport,
    useBulkCreateDoReport,
} from '../data/hooks'
import { doReportSchema, type DoReportData } from '../data/schema'
import { useParseExcel } from '../hooks/use-parse-excel'
import { useDoReport } from './do-report-provider'

type DoReportActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: DoReportData
}

export function DoReportActionDialog({
    open,
    onOpenChange,
}: DoReportActionDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { currentRow, millId, setCurrentRow } = useDoReport()
    const isEditing = !!currentRow

    // Paginated committee selection for samitiSangrahan
    const committee = usePaginatedList(
        millId,
        open,
        {
            useListHook: useCommitteeList,
            extractItems: (data) =>
                data.committees
                    .map((c) => c.committeeName)
                    .filter(Boolean) as string[],
            hookParams: { sortBy: 'committeeName', sortOrder: 'asc' },
        },
        currentRow?.samitiSangrahan
    )
    const createMutation = useCreateDoReport(millId)
    const updateMutation = useUpdateDoReport(millId)
    const bulkCreateMutation = useBulkCreateDoReport(millId)
    const isLoading =
        createMutation.isPending ||
        updateMutation.isPending ||
        bulkCreateMutation.isPending
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [previewData, setPreviewData] = useState<DoReportData[]>([])
    const [activeTab, setActiveTab] = useState<string>('manual')
    const { parseFile, parseStats } = useParseExcel()

    const form = useForm<DoReportData>({
        resolver: zodResolver(doReportSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            samitiSangrahan: '',
            doNo: '',
            dhanMota: '' as unknown as number,
            dhanPatla: '' as unknown as number,
            dhanSarna: '' as unknown as number,
            total: 0,
        },
    })

    const dhanMotaValue = form.watch('dhanMota')
    const dhanPatlaValue = form.watch('dhanPatla')
    const dhanSarnaValue = form.watch('dhanSarna')

    useEffect(() => {
        const mota = Number(dhanMotaValue || 0)
        const patla = Number(dhanPatlaValue || 0)
        const sarna = Number(dhanSarnaValue || 0)
        const total = mota + patla + sarna
        form.setValue('total', total, { shouldValidate: false })
    }, [dhanMotaValue, dhanPatlaValue, dhanSarnaValue, form])

    useEffect(() => {
        if (currentRow) {
            form.reset({
                date: currentRow.date || '',
                samitiSangrahan: currentRow.samitiSangrahan || '',
                doNo: currentRow.doNo || '',
                dhanMota: currentRow.dhanMota || ('' as unknown as number),
                dhanPatla: currentRow.dhanPatla || ('' as unknown as number),
                dhanSarna: currentRow.dhanSarna || ('' as unknown as number),
                total: currentRow.total ?? 0,
            })
            setActiveTab('manual')
        } else {
            form.reset({
                date: format(new Date(), 'yyyy-MM-dd'),
                samitiSangrahan: '',
                doNo: '',
                dhanMota: '' as unknown as number,
                dhanPatla: '' as unknown as number,
                dhanSarna: '' as unknown as number,
                total: 0,
            })
            setActiveTab('manual')
        }
    }, [currentRow, form])

    const handleSuccess = () => {
        onOpenChange(false)
        form.reset({
            date: format(new Date(), 'yyyy-MM-dd'),
            samitiSangrahan: '',
            doNo: '',
            dhanMota: '' as unknown as number,
            dhanPatla: '' as unknown as number,
            dhanSarna: '' as unknown as number,
            total: 0,
        })
        setUploadedFile(null)
        setPreviewData([])
        setCurrentRow(null)
    }

    const handleUpload = async () => {
        if (previewData.length === 0) return

        try {
            await bulkCreateMutation.mutateAsync(previewData)
            handleSuccess()
        } catch (error) {
            console.error('Error uploading file:', error)
        }
    }

    const onSubmit = async (data: DoReportData) => {
        const computedTotal =
            (data.dhanMota ?? 0) + (data.dhanPatla ?? 0) + (data.dhanSarna ?? 0)
        const payload = {
            ...data,
            total: computedTotal,
        }

        try {
            if (currentRow?._id) {
                await updateMutation.mutateAsync({
                    _id: currentRow._id,
                    ...payload,
                })
            } else {
                await createMutation.mutateAsync(payload)
            }
            handleSuccess()
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    const handleDialogClose = (isOpen: boolean) => {
        if (!isOpen) {
            form.reset({
                date: format(new Date(), 'yyyy-MM-dd'),
                samitiSangrahan: '',
                doNo: '',
                dhanMota: 0,
                dhanPatla: 0,
                dhanSarna: 0,
                total: 0,
            })
            setUploadedFile(null)
            setPreviewData([])
            setActiveTab('manual')
        }
        onOpenChange(isOpen)
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadedFile(file)

        const result = await parseFile(file)
        if (result && result.data) {
            setPreviewData(result.data as DoReportData[])
        } else {
            setPreviewData([])
        }
    }

    const formatPreviewCell = (value: unknown): string => {
        if (value === null || value === undefined) return '-'
        if (typeof value === 'string') {
            return value.trim() === '' ? '-' : value
        }
        return String(value)
    }

    const fieldOrder = [
        'samitiSangrahan',
        'doNo',
        'date',
        'dhanMota',
        'dhanPatla',
        'dhanSarna',
        'total',
    ] as const

    const fieldLabels: Record<string, string> = {
        samitiSangrahan: 'समिती - उपार्जन केन्द्र',
        doNo: 'डी.ओ.',
        date: 'डी.ओ.दिनांक',
        dhanMota: 'मोटा',
        dhanPatla: 'पतला',
        dhanSarna: 'सरना',
        total: 'कुल',
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className='max-h-[90vh] overflow-y-auto p-4 sm:max-w-4xl sm:p-6'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? t('common.edit') : t('common.add')}{' '}
                        {t('inputReports.do.title').replace(' Report', '')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('inputReports.do.form.description')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='w-full max-w-full space-y-4'
                    >
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className='w-full'
                        >
                            <TabsList className='grid w-full grid-cols-2'>
                                <TabsTrigger value='manual'>
                                    {t('common.manualEntry')}
                                </TabsTrigger>
                                <TabsTrigger
                                    value='upload'
                                    disabled={isEditing}
                                >
                                    {t('common.uploadFile')}
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent
                                value='manual'
                                className='w-full space-y-6'
                            >
                                <div className='grid grid-cols-2 gap-4'>
                                    <FormField
                                        control={form.control}
                                        name='date'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t(
                                                        'inputReports.do.form.fields.date'
                                                    )}
                                                </FormLabel>
                                                <Popover>
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
                                                            onSelect={(
                                                                date
                                                            ) => {
                                                                field.onChange(
                                                                    date
                                                                        ? format(
                                                                            date,
                                                                            'yyyy-MM-dd'
                                                                        )
                                                                        : ''
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
                                        name='samitiSangrahan'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t(
                                                        'inputReports.do.form.fields.samitiSangrahan'
                                                    )}
                                                </FormLabel>
                                                <FormControl>
                                                    <PaginatedCombobox
                                                        value={field.value}
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        paginatedList={
                                                            committee
                                                        }
                                                        placeholder='Committee Collection'
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
                                        name='doNo'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t(
                                                        'inputReports.do.form.fields.doNo'
                                                    )}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='DO Number'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='dhanMota'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t(
                                                        'inputReports.do.form.fields.dhanMota'
                                                    )}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        step='0.01'
                                                        {...field}
                                                        value={
                                                            field.value ?? ''
                                                        }
                                                        onWheel={(e) =>
                                                            e.currentTarget.blur()
                                                        }
                                                        onChange={(e) => {
                                                            const value =
                                                                e.target.value

                                                            field.onChange(
                                                                value === ''
                                                                    ? ''
                                                                    : Number(
                                                                        value
                                                                    )
                                                            )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='dhanPatla'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t(
                                                        'inputReports.do.form.fields.dhanPatla'
                                                    )}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        step='0.01'
                                                        {...field}
                                                        value={
                                                            field.value ?? ''
                                                        }
                                                        onWheel={(e) =>
                                                            e.currentTarget.blur()
                                                        }
                                                        onChange={(e) => {
                                                            const value =
                                                                e.target.value
                                                            field.onChange(
                                                                value === ''
                                                                    ? ''
                                                                    : Number(
                                                                        value
                                                                    )
                                                            )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='dhanSarna'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t(
                                                        'inputReports.do.form.fields.dhanSarna'
                                                    )}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        step='0.01'
                                                        {...field}
                                                        value={
                                                            field.value ?? ''
                                                        }
                                                        onWheel={(e) =>
                                                            e.currentTarget.blur()
                                                        }
                                                        onChange={(e) => {
                                                            const value =
                                                                e.target.value
                                                            field.onChange(
                                                                value === ''
                                                                    ? ''
                                                                    : Number(
                                                                        value
                                                                    )
                                                            )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='total'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t(
                                                        'inputReports.do.form.fields.total'
                                                    )}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        step='0.01'
                                                        readOnly
                                                        {...field}
                                                        value={field.value ?? 0}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </TabsContent>
                            <TabsContent
                                value='upload'
                                className='w-full space-y-4'
                            >
                                <FormItem>
                                    <FormLabel>Upload Excel File</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='file'
                                            accept='.xlsx,.xls,.csv'
                                            className='cursor-pointer'
                                            onChange={handleFileUpload}
                                        />
                                    </FormControl>
                                    <p className='mt-2 text-sm text-gray-500'>
                                        Supported formats: Excel (.xlsx, .xls)
                                        or CSV
                                    </p>
                                    {uploadedFile && (
                                        <p className='mt-2 text-sm break-all text-green-600'>
                                            File selected: {uploadedFile.name}
                                        </p>
                                    )}
                                </FormItem>

                                {previewData.length > 0 && (
                                    <div className='mt-6 w-full'>
                                        <div className='mb-4'>
                                            <h3 className='mb-3 text-sm font-semibold'>
                                                Parse Statistics
                                            </h3>
                                            <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                                                <div className='rounded-lg border bg-primary/10 p-3'>
                                                    <p className='text-xs text-muted-foreground'>
                                                        Total Rows
                                                    </p>
                                                    <p className='text-lg font-bold text-primary'>
                                                        {parseStats?.totalRows ||
                                                            0}
                                                    </p>
                                                </div>
                                                <div className='rounded-lg border bg-chart-2/10 p-3'>
                                                    <p className='text-xs text-muted-foreground'>
                                                        Successfully Parsed
                                                    </p>
                                                    <p className='text-lg font-bold text-chart-2'>
                                                        {parseStats?.successRows ||
                                                            0}
                                                    </p>
                                                </div>
                                                <div className='rounded-lg border bg-destructive/10 p-3'>
                                                    <p className='text-xs text-muted-foreground'>
                                                        Failed/Skipped
                                                    </p>
                                                    <p className='text-lg font-bold text-destructive'>
                                                        {parseStats?.failedRows ||
                                                            0}
                                                    </p>
                                                </div>
                                            </div>

                                            {parseStats?.errorDetails &&
                                                parseStats.errorDetails.length >
                                                0 && (
                                                    <div className='mt-3'>
                                                        <p className='mb-2 text-xs font-semibold text-gray-600'>
                                                            Error Details:
                                                        </p>
                                                        <div className='max-h-24 overflow-y-auto rounded border border-red-200 bg-red-50 p-2'>
                                                            <ul className='space-y-1 text-xs text-red-700'>
                                                                {parseStats.errorDetails.map(
                                                                    (
                                                                        error,
                                                                        idx
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className='flex items-start gap-2'
                                                                        >
                                                                            <span className='mt-0.5 text-red-500'>
                                                                                •
                                                                            </span>
                                                                            <span>
                                                                                {
                                                                                    error
                                                                                }
                                                                            </span>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>

                                        <h3 className='mb-3 text-sm font-semibold'>
                                            Preview - {previewData.length}{' '}
                                            records
                                        </h3>
                                        <div className='w-full max-w-[calc(100vw-5rem)] overflow-x-auto rounded-lg border sm:max-w-full'>
                                            <div className='h-80 overflow-y-auto'>
                                                <Table>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell className='text-sm font-semibold text-muted-foreground'>
                                                                #
                                                            </TableCell>
                                                            {fieldOrder.map(
                                                                (field) => (
                                                                    <TableCell
                                                                        key={
                                                                            field
                                                                        }
                                                                        className='text-sm font-semibold text-muted-foreground'
                                                                    >
                                                                        {
                                                                            fieldLabels[
                                                                            field
                                                                            ]
                                                                        }
                                                                    </TableCell>
                                                                )
                                                            )}
                                                        </TableRow>
                                                        {previewData.map(
                                                            (row, idx) => (
                                                                <TableRow
                                                                    key={idx}
                                                                >
                                                                    <TableCell className='text-sm font-medium'>
                                                                        {idx +
                                                                            1}
                                                                    </TableCell>
                                                                    {fieldOrder.map(
                                                                        (
                                                                            field
                                                                        ) => (
                                                                            <TableCell
                                                                                key={
                                                                                    field
                                                                                }
                                                                                className='text-sm'
                                                                            >
                                                                                {formatPreviewCell(
                                                                                    row[
                                                                                    field as keyof DoReportData
                                                                                    ]
                                                                                )}
                                                                            </TableCell>
                                                                        )
                                                                    )}
                                                                </TableRow>
                                                            )
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                        <DialogFooter>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => handleDialogClose(false)}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                type={
                                    activeTab === 'upload' ? 'button' : 'submit'
                                }
                                onClick={
                                    activeTab === 'upload'
                                        ? handleUpload
                                        : undefined
                                }
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? activeTab === 'upload' &&
                                        previewData.length > 0
                                        ? t('common.uploading') + '...'
                                        : isEditing
                                            ? t('common.update') + '...'
                                            : t('common.add') + '...'
                                    : activeTab === 'upload' &&
                                        previewData.length > 0
                                        ? `${t('common.upload')} ${previewData.length} ${previewData.length > 1 ? t('inputReports.do.title').replace(' Report', 's') : t('inputReports.do.title').replace(' Report', '')}`
                                        : isEditing
                                            ? t('common.update')
                                            : t('common.add')}{' '}
                                {activeTab === 'manual' &&
                                    t('inputReports.do.title').replace(
                                        ' Report',
                                        ''
                                    )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
