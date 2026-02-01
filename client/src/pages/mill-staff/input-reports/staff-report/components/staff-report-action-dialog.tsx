import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
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
import { staffReportSchema, type StaffReportData } from '../data/schema'
import { useCreateStaffReport, useUpdateStaffReport } from '../data/hooks'
import { useUser } from '@/pages/landing/hooks/use-auth'

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
    const { user } = useUser()
    const millId = user?.millId as any
    const createMutation = useCreateStaffReport(millId)
    const updateMutation = useUpdateStaffReport(millId)
    const isLoading = createMutation.isPending || updateMutation.isPending

    const form = useForm<StaffReportData>({
        resolver: zodResolver(staffReportSchema),
        defaultValues: {
            _id: '',
            fullName: '',
            salary: undefined,
            phoneNumber: '',
            email: '',
            address: '',
        },
    })

    useEffect(() => {
        if (open) {
            if (currentRow) {
                form.reset(currentRow as any)
            } else {
                form.reset({
                    _id: '',
                    fullName: '',
                    salary: undefined,
                    phoneNumber: '',
                    email: '',
                    address: '',
                })
            }
        }
    }, [open, currentRow, form])

    const onSubmit = async (data: any) => {
        try {
            if (isEditing && currentRow?._id) {
                await updateMutation.mutateAsync({ 
                    id: currentRow._id, 
                    fullName: data.fullName,
                    salary: data.salary,
                    phoneNumber: data.phoneNumber,
                    email: data.email,
                    address: data.address,
                })
            } else {
                await createMutation.mutateAsync({
                    fullName: data.fullName,
                    salary: data.salary,
                    phoneNumber: data.phoneNumber,
                    email: data.email,
                    address: data.address,
                })
            }
            onOpenChange(false)
        } catch (error: any) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                                        <FormLabel>Staff Name</FormLabel>
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
                                        <Input
                                            placeholder='Enter address'
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
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type='submit'
                                disabled={isLoading}
                            >
                                {isLoading 
                                    ? (isEditing ? 'Updating...' : 'Adding...') 
                                    : (isEditing ? 'Update' : 'Add') 
                                } Staff
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
