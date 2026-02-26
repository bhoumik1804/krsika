import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useUser, useUpdateProfile, useChangePassword } from '@/pages/landing/hooks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const createProfileFormSchema = (t: (key: string) => string) =>
    z
        .object({
            name: z
                .string()
                .min(2, t('settings.form.validation.nameMin'))
                .max(30, t('settings.form.validation.nameMax')),
            email: z.string().email(t('settings.form.validation.emailInvalid')),
            role: z.string().optional(),
            post: z.string().optional(),
            currentPassword: z.string().optional(),
            newPassword: z.string().optional(),
            confirmPassword: z.string().optional(),
        })
        .superRefine((data, ctx) => {
            if (data.newPassword && data.newPassword.length > 0) {
                if (data.newPassword.length < 6) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: t('settings.form.validation.passwordMin'),
                        path: ['newPassword'],
                    })
                }
                if (!data.currentPassword) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: t(
                            'settings.form.validation.currentPasswordRequired'
                        ),
                        path: ['currentPassword'],
                    })
                }
                if (data.newPassword !== data.confirmPassword) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: t('settings.form.validation.passwordMatch'),
                        path: ['confirmPassword'],
                    })
                }
            }
        })

type ProfileFormValues = z.infer<ReturnType<typeof createProfileFormSchema>>

export function ProfileForm() {
    const { t } = useTranslation()
    const { user } = useUser()
    const { updateProfileAsync, isLoading: isUpdating } = useUpdateProfile()
    const { changePasswordAsync, isLoading: isChangingPassword } =
        useChangePassword()

    const isLoading = isUpdating || isChangingPassword
    const profileFormSchema = createProfileFormSchema(t)
    const roleLabels: Record<string, string> = {
        'super-admin': t('settings.form.roles.superAdmin'),
        'mill-admin': t('settings.form.roles.millAdmin'),
        'mill-staff': t('settings.form.roles.millStaff'),
    }

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user?.fullName || '',
            email: user?.email || '',
            role: user?.role || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        mode: 'onChange',
    })

    async function onSubmit(data: ProfileFormValues) {
        try {
            await updateProfileAsync({
                fullName: data.name,
                // post update might need backend support if it's editable
            })

            if (data.newPassword && data.currentPassword) {
                await changePasswordAsync({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                })
                toast.success(
                    t('settings.form.success.profileAndPasswordUpdated')
                )
            } else {
                toast.success(t('settings.form.success.profileUpdated'))
            }
        } catch (error: any) {
            toast.error(
                error.message || t('settings.form.error.failedToUpdateProfile')
            )
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8'
            >
                <div className='grid gap-4 md:grid-cols-2'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('settings.form.name')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t(
                                            'settings.form.namePlaceholder'
                                        )}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    {t('settings.form.nameDesc')}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('settings.form.email')}</FormLabel>
                                <FormControl>
                                    <Input
                                        type='email'
                                        placeholder={t(
                                            'settings.form.emailPlaceholder'
                                        )}
                                        {...field}
                                        readOnly
                                    />
                                </FormControl>
                                <FormDescription>
                                    {t('settings.form.emailDesc')}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='post'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('settings.form.post')}</FormLabel>
                                <FormControl>
                                    <Input type='text' {...field} readOnly />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='space-y-4 rounded-lg border p-4'>
                    <h3 className='text-lg font-medium'>
                        {t('settings.form.changePassword')}
                    </h3>
                    <div className='grid gap-4 md:grid-cols-2'>
                        <FormField
                            control={form.control}
                            name='currentPassword'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t('settings.form.currentPassword')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder={t(
                                                'settings.form.currentPasswordPlaceholder'
                                            )}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='hidden md:block'></div>
                        <FormField
                            control={form.control}
                            name='newPassword'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t('settings.form.newPassword')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder={t(
                                                'settings.form.newPasswordPlaceholder'
                                            )}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='confirmPassword'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t('settings.form.confirmPassword')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder={t(
                                                'settings.form.confirmPasswordPlaceholder'
                                            )}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name='role'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('settings.form.role')}</FormLabel>
                            <div className='pt-1'>
                                <Badge variant='secondary'>
                                    {roleLabels[field.value ?? ''] ??
                                        field.value}
                                </Badge>
                            </div>
                            <FormDescription>
                                {t('settings.form.roleDesc')}
                            </FormDescription>
                        </FormItem>
                    )}
                />

                <Button type='submit' disabled={isLoading}>
                    {isLoading
                        ? t('settings.form.updating')
                        : t('settings.form.updateProfile')}
                </Button>
            </form>
        </Form>
    )
}
