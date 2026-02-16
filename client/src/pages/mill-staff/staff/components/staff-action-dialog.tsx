'use client'

import { useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { showSubmittedData } from '@/lib/show-submitted-data'
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
import { SelectDropdown } from '@/components/select-dropdown'
import { posts } from '../data/data'
import { type Staff } from '../data/schema'

const getFormSchema = (t: TFunction<'millStaff', undefined>) =>
    z
        .object({
            fullName: z.string().min(2, t('staff.form.validation.nameMin')),
            phoneNumber: z.string().optional(),
            email: z.string().email(t('staff.form.validation.emailInvalid')),
            password: z.string().transform((pwd) => pwd.trim()),
            post: z.string().optional(),
            salary: z.number().optional(),
            address: z.string().optional(),
            confirmPassword: z.string().transform((pwd) => pwd.trim()),
            isEdit: z.boolean(),
        })
        .refine(
            (data) => {
                if (data.isEdit && !data.password) return true
                return data.password.length > 0
            },
            {
                message: t('staff.form.validation.passwordRequired'),
                path: ['password'],
            }
        )
        .refine(
            ({ isEdit, password }) => {
                if (isEdit && !password) return true
                return password.length >= 8
            },
            {
                message: t('staff.form.validation.passwordMin'),
                path: ['password'],
            }
        )
        .refine(
            ({ isEdit, password }) => {
                if (isEdit && !password) return true
                return /[a-z]/.test(password)
            },
            {
                message: t('staff.form.validation.passwordLower'),
                path: ['password'],
            }
        )
        .refine(
            ({ isEdit, password }) => {
                if (isEdit && !password) return true
                return /\d/.test(password)
            },
            {
                message: t('staff.form.validation.passwordNumber'),
                path: ['password'],
            }
        )
        .refine(
            ({ isEdit, password, confirmPassword }) => {
                if (isEdit && !password) return true
                return password === confirmPassword
            },
            {
                message: t('staff.form.validation.passwordMatch'),
                path: ['confirmPassword'],
            }
        )

type StaffForm = z.infer<ReturnType<typeof getFormSchema>>

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
    const { t } = useTranslation('mill-staff')
    const isEdit = !!currentRow
    const formSchema = useMemo(() => getFormSchema(t), [t])

    const form = useForm<StaffForm>({
        resolver: zodResolver(formSchema),
        defaultValues: isEdit
            ? {
                  fullName: currentRow.fullName,
                  email: currentRow.email,
                  phoneNumber: currentRow.phoneNumber || '',
                  post: currentRow.post || '',
                  salary: currentRow.salary,
                  address: currentRow.address || '',
                  password: '',
                  confirmPassword: '',
                  isEdit,
              }
            : {
                  fullName: '',
                  email: '',
                  post: '',
                  phoneNumber: '',
                  salary: undefined,
                  address: '',
                  password: '',
                  confirmPassword: '',
                  isEdit,
              },
    })

    const onSubmit = (values: StaffForm) => {
        form.reset()
        showSubmittedData(values)
        onOpenChange(false)
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
                        {isEdit ? t('staff.editStaff') : t('staff.addStaff')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? t('staff.editStaffDescription') ||
                              'Update the staff member here. '
                            : t('staff.addStaffDescription') ||
                              'Create new staff member here. '}
                        {t('staff.clickSave')}
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
                                            {t('staff.form.fullName')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'staff.form.fullNamePlaceholder'
                                                )}
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
                                            {t('staff.form.email')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'staff.form.emailPlaceholder'
                                                )}
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
                                            {t('staff.form.phoneNumber')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'staff.form.phoneNumberPlaceholder'
                                                )}
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
                                name='post'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            {t('staff.form.post')}
                                        </FormLabel>
                                        <SelectDropdown
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                            placeholder={t(
                                                'staff.form.postPlaceholder'
                                            )}
                                            className='col-span-4'
                                            items={posts.map(({ value }) => ({
                                                label: t(
                                                    `staff.posts.${value}`
                                                ),
                                                value,
                                            }))}
                                        />
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='salary'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            {t('staff.form.salary')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                placeholder={t(
                                                    'staff.form.salaryPlaceholder'
                                                )}
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
                                            {t('staff.form.address')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'staff.form.addressPlaceholder'
                                                )}
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
                                            {t('staff.form.password')}
                                        </FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                placeholder={t(
                                                    'staff.form.passwordPlaceholder'
                                                )}
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
                                            {t('staff.form.confirmPassword')}
                                        </FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                disabled={!isPasswordTouched}
                                                placeholder={t(
                                                    'staff.form.confirmPasswordPlaceholder'
                                                )}
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
                    <Button type='submit' form='staff-form'>
                        {t('staff.saveChanges')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
