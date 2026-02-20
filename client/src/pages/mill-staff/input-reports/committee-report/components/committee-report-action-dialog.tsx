import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { committeeTypeOptions } from '@/constants/input-form'
import { Button } from '@/components/ui/button'
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    useCreateCommittee,
    useUpdateCommittee,
    useBulkCreateCommittees,
} from '../data/hooks'
import { committeeReportSchema, type CommitteeReportData } from '../data/schema'
import { useParseExcel } from '../hooks/use-parse-excel'
import { useCommitteeReport } from './committee-report-provider'

type CommitteeReportActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: CommitteeReportData
}

export function CommitteeReportActionDialog({
    open,
    onOpenChange,
}: CommitteeReportActionDialogProps) {
    const { t } = useTranslation('mill-staff')
    const { currentRow, millId, setCurrentRow } = useCommitteeReport()
    const { mutate: createCommittee, isPending: isCreating } =
        useCreateCommittee(millId)
    const { mutate: updateCommittee, isPending: isUpdating } =
        useUpdateCommittee(millId)
    const { mutate: bulkCreateCommittees, isPending: isBulkCreating } =
        useBulkCreateCommittees(millId)

    const isEditing = !!currentRow
    const isLoading = isCreating || isUpdating || isBulkCreating
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [previewData, setPreviewData] = useState<CommitteeReportData[]>([])
    const [activeTab, setActiveTab] = useState<string>('manual')
    const { parseFile, parseStats } = useParseExcel()

    const form = useForm<CommitteeReportData>({
        resolver: zodResolver(committeeReportSchema),
        defaultValues: {
            committeeType: '',
            committeeName: '',
        },
    })

    // Reset form when dialog opens or currentRow changes
    useEffect(() => {
        if (open) {
            if (currentRow) {
                form.reset({
                    committeeType: currentRow.committeeType || '',
                    committeeName: currentRow.committeeName || '',
                })
                setActiveTab('manual')
            } else {
                form.reset({
                    committeeType: '',
                    committeeName: '',
                })
                setActiveTab('manual')
            }
        }
    }, [open, currentRow, form])

    const onSubmit = (data: CommitteeReportData) => {
        // Check if we're on the upload tab and have preview data
        if (activeTab === 'upload' && previewData.length > 0) {
            // Bulk create from uploaded file
            bulkCreateCommittees(previewData, {
                onSuccess: () => {
                    onOpenChange(false)
                    form.reset()
                    setUploadedFile(null)
                    setPreviewData([])
                    setCurrentRow(null)
                },
            })
        } else if (isEditing) {
            updateCommittee(
                { committeeId: currentRow?._id || '', data },
                {
                    onSuccess: () => {
                        onOpenChange(false)
                        form.reset()
                        setUploadedFile(null)
                        setPreviewData([])
                        setCurrentRow(null)
                    },
                }
            )
        } else {
            createCommittee(data, {
                onSuccess: () => {
                    onOpenChange(false)
                    form.reset()
                    setUploadedFile(null)
                    setPreviewData([])
                    setCurrentRow(null)
                },
            })
        }
    }

    const handleDialogClose = (isOpen: boolean) => {
        if (!isOpen) {
            setCurrentRow(null)
            form.reset()
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
            // Type the parsed data as CommitteeReportData[]
            setPreviewData(result.data as CommitteeReportData[])
        } else {
            setPreviewData([])
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-x-hidden overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? t('common.edit') : t('common.add')}{' '}
                        {t('inputReports.committee.title').replace(
                            ' Report',
                            ''
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {t('common.enter')}{' '}
                        {t('inputReports.committee.description').toLowerCase()}
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
                                    {t('common.manualEntry')}
                                </TabsTrigger>
                                <TabsTrigger
                                    value='upload'
                                    disabled={isEditing}
                                >
                                    {t('common.uploadFile')}
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value='manual' className='space-y-6'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <FormField
                                        control={form.control}
                                        name='committeeType'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t(
                                                        'inputReports.committee.form.fields.committeeType'
                                                    )}
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue
                                                                placeholder='Select'
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className='w-full'>
                                                        {committeeTypeOptions.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    value={
                                                                        option.value
                                                                    }
                                                                >
                                                                    {
                                                                        option.label
                                                                    }
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
                                        name='committeeName'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t(
                                                        'inputReports.committee.form.fields.committeeName'
                                                    )}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='Committee Name'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </TabsContent>
                            <TabsContent value='upload' className='space-y-4'>
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
                                        <div className='overflow-x-auto rounded-lg border'>
                                            <div className='h-80 overflow-x-auto overflow-y-auto'>
                                                <Table>
                                                    <TableBody>
                                                        {previewData.map(
                                                            (row, idx) => (
                                                                <TableRow
                                                                    key={idx}
                                                                >
                                                                    <TableCell className='text-sm font-medium'>
                                                                        {idx +
                                                                            1}
                                                                    </TableCell>
                                                                    {Object.values(
                                                                        row as Record<
                                                                            string,
                                                                            unknown
                                                                        >
                                                                    ).map(
                                                                        (
                                                                            value,
                                                                            cellIdx
                                                                        ) => (
                                                                            <TableCell
                                                                                key={
                                                                                    cellIdx
                                                                                }
                                                                                className='text-sm'
                                                                            >
                                                                                {String(
                                                                                    value ||
                                                                                    '-'
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
                            <Button type='submit' disabled={isLoading}>
                                {isLoading
                                    ? activeTab === 'upload' &&
                                        previewData.length > 0
                                        ? t('common.uploading') + '...'
                                        : isEditing
                                            ? t('common.update') + '...'
                                            : t('common.add') + '...'
                                    : activeTab === 'upload' &&
                                        previewData.length > 0
                                        ? `${t('common.upload')} ${previewData.length} ${previewData.length > 1 ? t('inputReports.committee.title').replace(' Report', 's') : t('inputReports.committee.title').replace(' Report', '')}`
                                        : isEditing
                                            ? t('common.update')
                                            : t('common.add')}{' '}
                                {activeTab === 'manual' &&
                                    t('inputReports.committee.title').replace(
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
