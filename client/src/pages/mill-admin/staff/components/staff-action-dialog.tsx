'use client'

import { z } from 'zod'
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
import { PasswordInput } from '@/components/password-input'
import { useCreateStaff, useUpdateStaff } from '../data/hooks'
import { type Staff } from '../data/schema'

const formSchema = z
    .object({
        fullName: z
            .string()
            .min(2, 'Full Name must be at least 2 characters.')
            .max(100, 'Full Name must be at most 100 characters.'),
        phoneNumber: z
            .string()
            .min(10, 'Phone number must be at least 10 digits.')
            .max(15, 'Phone number must be at most 15 digits.')
            .optional()
            .or(z.literal('')),
        email: z.email({
            error: (iss) =>
                iss.input === '' ? 'Email is required.' : undefined,
        }),
        password: z.string().transform((pwd) => pwd.trim()),
        confirmPassword: z.string().transform((pwd) => pwd.trim()),
        isEdit: z.boolean(),
    })
    .refine(
        (data) => {
            if (data.isEdit && !data.password) return true
            return data.password.length > 0
        },
        {
            message: 'Password is required.',
            path: ['password'],
        }
    )
    .refine(
        ({ isEdit, password }) => {
            if (isEdit && !password) return true
            return password.length >= 8
        },
        {
            message: 'Password must be at least 8 characters long.',
            path: ['password'],
        }
    )
    .refine(
        ({ isEdit, password }) => {
            if (isEdit && !password) return true
            return /[a-z]/.test(password)
        },
        {
            message: 'Password must contain at least one lowercase letter.',
            path: ['password'],
        }
    )
    .refine(
        ({ isEdit, password }) => {
            if (isEdit && !password) return true
            return /\d/.test(password)
        },
        {
            message: 'Password must contain at least one number.',
            path: ['password'],
        }
    )
    .refine(
        ({ isEdit, password, confirmPassword }) => {
            if (isEdit && !password) return true
            return password === confirmPassword
        },
        {
            message: "Passwords don't match.",
            path: ['confirmPassword'],
        }
    )
type StaffForm = z.infer<typeof formSchema>

type StaffActionDialogProps = {
    currentRow?: Staff
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function StaffActionDialog({
    currentRow,
    open,
    onOpenChange,
}: StaffActionDialogProps) {
    const { millId } = useParams<{ millId: string }>()
    const isEdit = !!currentRow

    const createMutation = useCreateStaff(millId || '')
    const updateMutation = useUpdateStaff(millId || '')

    const form = useForm<StaffForm>({
        resolver: zodResolver(formSchema),
        defaultValues: isEdit
            ? {
                  ...currentRow,
                  password: '',
                  confirmPassword: '',
                  isEdit,
              }
            : {
                  fullName: '',
                  email: '',
                  phoneNumber: '',
                  password: '',
                  confirmPassword: '',
                  isEdit,
              },
    })

    const onSubmit = async (values: StaffForm) => {
        try {
            if (isEdit && currentRow) {
                await updateMutation.mutateAsync({
                    id: currentRow._id,
                    fullName: values.fullName,
                    email: values.email,
                    phoneNumber: values.phoneNumber || '',
                    isActive: currentRow.isActive,
                })
            } else {
                await createMutation.mutateAsync({
                    fullName: values.fullName,
                    email: values.email,
                    phoneNumber: values.phoneNumber || '',
                    password: values.password,
                })
            }
            form.reset()
            onOpenChange(false)
        } catch (error) {
            // Error is already handled by the mutation's onError
            console.error('Staff operation failed:', error)
        }
    }

    const isPasswordTouched = !!form.formState.dirtyFields.password

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                form.reset()
                onOpenChange(state)
            }}
        >
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader className='text-start'>
                    <DialogTitle>
                        {isEdit ? 'Edit Staff' : 'Add New Staff'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update the staff member here. '
                            : 'Create new staff member here. '}
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
                    <Form {...form}>
                        <form
                            id='staff-form'
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-4 px-0.5'
                        >
                            <FormField
                                control={form.control}
                                name='fullName'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Full Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='John Doe'
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
                                                placeholder='john.doe@gmail.com'
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
                                name='phoneNumber'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Phone Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='+123456789'
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
                                name='password'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                placeholder='e.g., S3cur3P@ssw0rd'
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
                                name='confirmPassword'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Confirm Password
                                        </FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                disabled={!isPasswordTouched}
                                                placeholder='e.g., S3cur3P@ssw0rd'
                                                className='col-span-4'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <Button
                        type='submit'
                        form='staff-form'
                        disabled={
                            createMutation.isPending || updateMutation.isPending
                        }
                    >
                        {createMutation.isPending || updateMutation.isPending
                            ? 'Saving...'
                            : isEdit
                              ? 'Save changes'
                              : 'Create Staff'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
