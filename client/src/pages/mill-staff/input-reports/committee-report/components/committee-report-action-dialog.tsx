import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
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
import { committeeReportSchema, type CommitteeReportData } from '../data/schema'
import { useParseExcel } from '../hooks/use-parse-excel'
import { useCreateCommittee, useUpdateCommittee, useBulkCreateCommittees } from '../data/hooks'
import { useUser } from '@/pages/landing/hooks/use-auth'

type CommitteeReportActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: CommitteeReportData | null
}

export function CommitteeReportActionDialog({
    open,
    onOpenChange,
    currentRow,
}: CommitteeReportActionDialogProps) {
    const { user } = useUser()
    const millId = user?.millId as any
    const createMutation = useCreateCommittee(millId)
    const updateMutation = useUpdateCommittee(millId)
    const bulkCreateMutation = useBulkCreateCommittees(millId)
    const isLoading = createMutation.isPending || updateMutation.isPending || bulkCreateMutation.isPending
    const isEditing = !!currentRow?._id
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [previewData, setPreviewData] = useState<unknown[]>([])
    const { parseFile, parseStats } = useParseExcel()

    const form = useForm<CommitteeReportData>({
        resolver: zodResolver(committeeReportSchema),
        defaultValues: {
            committeeType: '',
            committeeName: '',
        },
    })


    useEffect(() => {
        if (open) {
            if (currentRow) {
                form.reset(currentRow)
            } else {
                form.reset()
                setPreviewData([])
                setUploadedFile(null)
            }
        }
    }, [currentRow, form, open])

    const onSubmit = async (data: CommitteeReportData) => {
        try {
            // Handle bulk upload from file
            if (previewData.length > 0) {
                console.log('previewData before mutation:', previewData)
                console.log('previewData[0] type:', typeof previewData[0], Array.isArray(previewData[0]))
                console.log('previewData[0]:', previewData[0])
                await bulkCreateMutation.mutateAsync(previewData as any)
            } 
            // Handle single record create/update
            else if (isEditing && currentRow?._id) {
                await updateMutation.mutateAsync({
                    id: currentRow._id,
                    ...data,
                })
            } else {
                await createMutation.mutateAsync(data)
            }
            onOpenChange(false)
            form.reset()
            setUploadedFile(null)
            setPreviewData([])
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadedFile(file)

        const result = await parseFile(file)
        if (result) {
            setPreviewData(result.data)
        } else {
            setPreviewData([])
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-x-hidden overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit' : 'Add'} Committee
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update' : 'Enter'} the committee details
                        below
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <Tabs defaultValue='manual' className='w-full'>
                            <TabsList className='grid w-full grid-cols-2'>
                                <TabsTrigger value='manual'>
                                    Manual Entry
                                </TabsTrigger>
                                <TabsTrigger value='upload'>
                                    Upload File
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
                                                    Select Committee Type
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder='Select' />
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
                                                    Committee Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='Enter committee name'
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
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type='submit' disabled={isLoading}>
                                {isLoading
                                    ? isEditing
                                        ? 'Updating...'
                                        : 'Adding...'
                                    : isEditing
                                      ? 'Update'
                                      : 'Add'} Committee
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
