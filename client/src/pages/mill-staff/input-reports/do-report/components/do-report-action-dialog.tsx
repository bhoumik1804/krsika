import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { useParams } from 'react-router'
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
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    useCreateDoReport,
    useUpdateDoReport,
    useBulkCreateDoReport,
} from '../data/hooks'
import { doReportSchema, type DoReportData } from '../data/schema'
import { useParseExcel } from '../hooks/use-parse-excel'
import { doReport } from './do-report-provider'

type DoReportActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: DoReportData | null
}

export function DoReportActionDialog({
    open,
    onOpenChange,
    currentRow,
}: DoReportActionDialogProps) {
    const isEditing = !!currentRow
    const { setCurrentRow } = doReport()
    const { millId } = useParams<{ millId: string }>()
    const createMutation = useCreateDoReport(millId || '')
    const updateMutation = useUpdateDoReport(millId || '')
    const bulkCreateMutation = useBulkCreateDoReport(millId || '')
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
            dhanMota: 0,
            dhanPatla: 0,
            dhanSarna: 0,
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
                dhanMota: currentRow.dhanMota || undefined,
                dhanPatla: currentRow.dhanPatla || undefined,
                dhanSarna: currentRow.dhanSarna || undefined,
                total: currentRow.total || undefined,
            })
            setActiveTab('manual')
        } else {
            form.reset({
                date: format(new Date(), 'yyyy-MM-dd'),
                samitiSangrahan: '',
                doNo: '',
                dhanMota: 0,
                dhanPatla: 0,
                dhanSarna: 0,
                total: 0,
            })
            setActiveTab('manual')
        }
    }, [currentRow, form])

    const onSubmit = async (data: DoReportData) => {
        const computedTotal =
            (data.dhanMota ?? 0) + (data.dhanPatla ?? 0) + (data.dhanSarna ?? 0)
        const payload = {
            ...data,
            total: computedTotal,
        }

        try {
            if (activeTab === 'upload' && previewData.length > 0) {
                await bulkCreateMutation.mutateAsync(previewData)
            } else if (currentRow?._id) {
                await updateMutation.mutateAsync({
                    id: currentRow._id,
                    ...payload,
                })
            } else {
                await createMutation.mutateAsync(payload)
            }
            onOpenChange(false)
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
            setCurrentRow(null)
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    const handleDialogClose = (isOpen: boolean) => {
        if (!isOpen) {
            setCurrentRow(null)
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
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit' : 'Add'} DO Report
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update' : 'Enter'} the DO report details
                        below
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className='w-full'
                        >
                            <TabsList className='grid w-full grid-cols-2'>
                                <TabsTrigger value='manual'>
                                    Manual Entry
                                </TabsTrigger>
                                <TabsTrigger
                                    value='upload'
                                    disabled={isEditing}
                                >
                                    Upload File
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
                                                <FormLabel>Date</FormLabel>
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
                                                    Samiti Sangrahan
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='Enter Samiti Sangrahan'
                                                        {...field}
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
                                                <FormLabel>DO Number</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='Enter DO number'
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
                                                    Dhan (Mota)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        step='0.01'
                                                        {...field}
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
                                                    Dhan (Patla)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        step='0.01'
                                                        {...field}
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
                                                    Dhan (Sarna)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        step='0.01'
                                                        {...field}
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
                                                <FormLabel>Total</FormLabel>
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
                                        <p className='mt-2 text-sm text-green-600'>
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
                                            <div className='grid grid-cols-3 gap-3'>
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
                                        <div className='w-full overflow-x-auto rounded-lg border'>
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
                                Cancel
                            </Button>
                            <Button type='submit' disabled={isLoading}>
                                {isLoading
                                    ? activeTab === 'upload' &&
                                      previewData.length > 0
                                        ? 'Uploading...'
                                        : isEditing
                                          ? 'Updating...'
                                          : 'Adding...'
                                    : activeTab === 'upload' &&
                                        previewData.length > 0
                                      ? `Upload ${previewData.length} Report${previewData.length > 1 ? 's' : ''}`
                                      : isEditing
                                        ? 'Update'
                                        : 'Add'}{' '}
                                {activeTab === 'manual' && 'DO Report'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
