import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'react-router'
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
import { Textarea } from '@/components/ui/textarea'
import { useCreateStaff, useUpdateStaff } from '../data/hooks'
import { staffReportSchema, type StaffReportData } from '../data/schema'
import { staffReport } from './staff-report-provider'

type StaffReportActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: StaffReportData | null
}

export function StaffReportActionDialog({
    open,
    onOpenChange,
    currentRow,
}: StaffReportActionDialogProps) {
    const isEditing = !!currentRow
    const { setCurrentRow } = staffReport()
    const { millId } = useParams<{ millId: string }>()
    const createMutation = useCreateStaff(millId || '')
    const updateMutation = useUpdateStaff(millId || '')
    const isLoading = createMutation.isPending || updateMutation.isPending

    const form = useForm<StaffReportData>({
        resolver: zodResolver(staffReportSchema),
        defaultValues: {
            fullName: '',
            post: '',
            salary: undefined,
            phoneNumber: '',
            email: '',
            address: '',
        },
    })

    useEffect(() => {
        if (currentRow) {
            form.reset({
                _id: currentRow._id || '',
                fullName: currentRow.fullName || '',
                post: currentRow.post || '',
                salary: currentRow.salary,
                phoneNumber: currentRow.phoneNumber || '',
                email: currentRow.email || '',
                address: currentRow.address || '',
            })
        } else {
            form.reset({
                fullName: '',
                post: '',
                salary: undefined,
                phoneNumber: '',
                email: '',
                address: '',
            })
        }
    }, [currentRow, form])

    const onSubmit = async (data: StaffReportData) => {
        const payload = {
            fullName: data.fullName,
            post: data.post,
            salary: data.salary,
            phoneNumber: data.phoneNumber,
            email: data.email,
            address: data.address,
        }
        try {
            if (currentRow?._id) {
                await updateMutation.mutateAsync({
                    id: currentRow._id,
                    ...payload,
                })
            } else {
                await createMutation.mutateAsync(payload)
            }
            onOpenChange(false)
            form.reset({
                fullName: '',
                post: '',
                salary: undefined,
                phoneNumber: '',
                email: '',
                address: '',
            })
            setCurrentRow(null)
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    const handleDialogClose = (isOpen: boolean) => {
        if (!isOpen) {
            setCurrentRow(null)
            form.reset({
                fullName: '',
                post: '',
                salary: undefined,
                phoneNumber: '',
                email: '',
                address: '',
            })
        }
        onOpenChange(isOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit' : 'Add'} Staff Member
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update' : 'Enter'} the staff details below
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
                                name='fullName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter full name'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='post'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Post</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter post/designation'
                                                {...field}
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
                                        <FormLabel>Salary</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                placeholder='Enter salary'
                                                {...field}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        isNaN(val) ? '' : val
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
                                name='phoneNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='tel'
                                                placeholder='Enter phone number'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='email'
                                                placeholder='Enter email address'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name='address'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='Enter address'
                                            rows={3}
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
                                onClick={() => handleDialogClose(false)}
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
                                      : 'Add'}{' '}
                                Staff
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
