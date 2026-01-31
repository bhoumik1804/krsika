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
import { useCreateMill, useUpdateMill } from '../data/hooks'
import type { Mill, MillStatus } from '../data/schema'

const formSchema = z.object({
    millName: z.string().min(1, 'Mill name is required.'),
    gstNumber: z.string().min(1, 'GST number is required.'),
    panNumber: z.string().min(1, 'PAN number is required.'),
    email: z.string().email('Valid email is required.'),
    phone: z.string().min(1, 'Phone number is required.'),
    address: z.string().optional(),
    status: z.enum(['PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'REJECTED']),
    isEdit: z.boolean(),
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

    const form = useForm<MillForm>({
        resolver: zodResolver(formSchema),
        defaultValues:
            isEdit && currentRow
                ? {
                      millName: currentRow.name,
                      gstNumber: currentRow.gstNumber,
                      panNumber: currentRow.panNumber,
                      email: currentRow.email,
                      phone: currentRow.phone,
                      address: currentRow.location,
                      status: currentRow.status,
                      isEdit,
                  }
                : {
                      millName: '',
                      gstNumber: '',
                      panNumber: '',
                      email: '',
                      phone: '',
                      address: '',
                      status: 'PENDING_VERIFICATION' as MillStatus,
                      isEdit,
                  },
    })

    const onSubmit = async (values: MillForm) => {
        const millData = {
            millName: values.millName,
            millInfo: {
                gstNumber: values.gstNumber,
                panNumber: values.panNumber,
            },
            contact: {
                email: values.email,
                phone: values.phone,
                address: values.address,
            },
            status: values.status as MillStatus,
        }

        if (isEdit && currentRow) {
            await updateMill.mutateAsync({
                id: currentRow.id,
                ...millData,
            })
        } else {
            await createMill.mutateAsync(millData)
        }

        form.reset()
        onOpenChange(false)
    }

    const isLoading = createMill.isPending || updateMill.isPending

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
                                                    value: 'PENDING_VERIFICATION',
                                                },
                                                {
                                                    label: 'Active',
                                                    value: 'ACTIVE',
                                                },
                                                {
                                                    label: 'Suspended',
                                                    value: 'SUSPENDED',
                                                },
                                                {
                                                    label: 'Rejected',
                                                    value: 'REJECTED',
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
                <DialogFooter>
                    <Button type='submit' form='mill-form' disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
