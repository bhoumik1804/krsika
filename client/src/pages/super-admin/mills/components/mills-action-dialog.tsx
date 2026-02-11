'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { SelectDropdown } from '@/components/select-dropdown'
import { useCreateMill, useUpdateMill, useVerifyMill } from '../data/hooks'
import type { Mill, MillStatus } from '../data/schema'
import { handleFormError } from '@/lib/handle-form-error'
import { handleServerError } from '@/lib/handle-server-error'
import { toast } from 'sonner'

const formSchema = z.object({
    millName: z
        .string()
        .min(1, 'Mill name is required')
        .max(200, 'Mill name is too long (max 200 characters)'),
    gstNumber: z
        .string()
        .min(15, 'GST number must be exactly 15 characters')
        .max(15, 'GST number must be exactly 15 characters'),
    panNumber: z
        .string()
        .min(10, 'PAN number must be exactly 10 characters')
        .max(10, 'PAN number must be exactly 10 characters'),
    mnmNumber: z
        .string()
        .regex(
            /^[A-Z]{2}\d{6}$/,
            'MNM number must start with 2 uppercase letters followed by 6 digits (e.g., MA123456)'
        ),
    email: z
        .string()
        .email('Invalid email format')
        .max(255, 'Email is too long'),
    phone: z
        .string()
        .min(10, 'Phone number must be at least 10 characters')
        .max(20, 'Phone number is too long'),
    address: z.string().max(500, 'Address is too long').optional(),
    city: z.string().max(100, 'City name is too long').optional(),
    state: z.string().max(100, 'State name is too long').optional(),
    pincode: z
        .string()
        .regex(/^\d{6}$/, 'Pincode must be exactly 6 digits')
        .optional(),
    status: z.enum(['pending-verification', 'active', 'suspended', 'rejected']),
})
type MillForm = z.infer<typeof formSchema>

type MillActionDialogProps = {
    currentRow?: Mill
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function MillsActionDialog({
    currentRow,
    open,
    onOpenChange,
}: MillActionDialogProps) {
    const isEdit = !!currentRow
    const createMill = useCreateMill()
    const updateMill = useUpdateMill()
    const verifyMill = useVerifyMill()

    const getDefaultValues = (): MillForm => {
        if (isEdit && currentRow) {
            const row: any = currentRow
            return {
                millName: row.name || '',
                gstNumber: row.gstNumber || '',
                panNumber: row.panNumber || '',
                mnmNumber: row.mnmNumber || '',
                email: row.email || '',
                phone: row.phone || '',
                address: row.location || '',
                city: '',
                state: '',
                pincode: '',
                status: (row.status || 'pending-verification') as MillStatus,
            }
        }
        return {
            millName: '',
            gstNumber: '',
            panNumber: '',
            mnmNumber: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            status: 'pending-verification' as MillStatus,
        }
    }

    const form = useForm<MillForm>({
        resolver: zodResolver(formSchema),
        defaultValues: getDefaultValues(),
    })

    const onSubmit = async (values: MillForm) => {
        const millData: any = {
            millName: values.millName,
            millInfo: {
                gstNumber: values.gstNumber,
                panNumber: values.panNumber,
                mnmNumber: values.mnmNumber,
            },
            contact: {
                email: values.email,
                phone: values.phone,
                address: values.address,
                city: values.city,
                state: values.state,
                pincode: values.pincode,
            },
            status: values.status,
        }


        try {
            if (isEdit && currentRow) {
                await updateMill.mutateAsync({
                    id: currentRow.id,
                    ...millData,
                })
            } else {
                await createMill.mutateAsync(millData)
            }
            toast.success(isEdit ? 'Mill updated successfully' : 'Mill created successfully')
            form.reset()
            onOpenChange(false)
        } catch (error) {
            const handled = handleFormError(error, form)
            if (!handled) {
                handleServerError(error)
            }
        }
    }

    const handleVerify = async () => {
        if (!currentRow) return
        const verifyData: any = {
            id: currentRow.id,
            status: 'active',
        }
        await verifyMill.mutateAsync(verifyData)
        form.reset()
        onOpenChange(false)
    }

    const isLoading =
        createMill.isPending || updateMill.isPending || verifyMill.isPending

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                if (!isLoading) {
                    form.reset()
                    onOpenChange(state)
                }
            }}
        >
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader className='text-start'>
                    <DialogTitle>
                        {isEdit ? 'Edit Mill' : 'Add New Mill'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update the mill here. '
                            : 'Create new mill here. '}
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
                    <Form {...form}>
                        <form
                            id='mill-form'
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-4 px-0.5'
                        >
                            <FormField
                                control={form.control}
                                name='millName'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Mill Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Rice Mill Pvt. Ltd.'
                                                className='col-span-4'
                                                autoComplete='off'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='gstNumber'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            GST Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='22AAAAA0000A1Z5'
                                                className='col-span-4'
                                                autoComplete='off'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='panNumber'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            PAN Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='ABCDE1234F'
                                                className='col-span-4'
                                                autoComplete='off'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='email'
                                                placeholder='contact@mill.com'
                                                className='col-span-4'
                                                autoComplete='off'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='phone'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Phone
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='+91 9876543210'
                                                className='col-span-4'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='address'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Address
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='123 Main Street, City'
                                                className='col-span-4'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='mnmNumber'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            MNM Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Mill Manager Number'
                                                className='col-span-4'
                                                autoComplete='off'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='city'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            City
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='City name'
                                                className='col-span-4'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='state'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            State
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='State name'
                                                className='col-span-4'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='pincode'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Pincode
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Postal code'
                                                className='col-span-4'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='status'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Status
                                        </FormLabel>
                                        <SelectDropdown
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                            placeholder='Select a status'
                                            className='col-span-4'
                                            items={[
                                                {
                                                    label: 'Pending Verification',
                                                    value: 'pending-verification',
                                                },
                                                {
                                                    label: 'Active',
                                                    value: 'active',
                                                },
                                                {
                                                    label: 'Suspended',
                                                    value: 'suspended',
                                                },
                                                {
                                                    label: 'Rejected',
                                                    value: 'rejected',
                                                },
                                            ]}
                                        />
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <DialogFooter className='flex justify-between'>
                    <div className='flex gap-2'>
                        {isEdit &&
                            ((currentRow as any)?.status ===
                                'pending-verification' ||
                                (currentRow as any)?.status ===
                                'PENDING_VERIFICATION') && (
                                <Button
                                    type='button'
                                    variant='default'
                                    onClick={handleVerify}
                                    disabled={isLoading}
                                    className='bg-green-600 hover:bg-green-700'
                                >
                                    {verifyMill.isPending
                                        ? 'Verifying...'
                                        : 'Verify & Approve'}
                                </Button>
                            )}
                    </div>
                    <Button type='submit' form='mill-form' disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
