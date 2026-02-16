import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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

const profileFormSchema = z
    .object({
        name: z
            .string()
            .min(2, 'Name must be at least 2 characters.')
            .max(30, 'Name must not be longer than 30 characters.'),
        email: z.string().email('Please enter a valid email.'),
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
                    message: 'Password must be at least 6 characters.',
                    path: ['newPassword'],
                })
            }
            if (!data.currentPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Current password is required to change password.',
                    path: ['currentPassword'],
                })
            }
            if (data.newPassword !== data.confirmPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Passwords do not match.',
                    path: ['confirmPassword'],
                })
            }
        }
    })

type ProfileFormValues = z.infer<typeof profileFormSchema>

const roleLabels: Record<string, string> = {
    'super-admin': 'Super Admin',
    'mill-admin': 'Mill Admin',
    'mill-staff': 'Mill Staff',
}

export function ProfileForm() {
    const { user } = useUser()
    const { updateProfileAsync, isLoading: isUpdating } = useUpdateProfile()
    const { changePasswordAsync, isLoading: isChangingPassword } =
        useChangePassword()

    const isLoading = isUpdating || isChangingPassword

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
                    'Profile and password updated successfully. You have been logged out.'
                )
            } else {
                toast.success('Profile updated successfully')
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile')
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
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Your name' {...field} />
                                </FormControl>
                                <FormDescription>
                                    Your public display name.
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
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type='email'
                                        placeholder='your@email.com'
                                        {...field}
                                        readOnly
                                    />
                                </FormControl>
                                <FormDescription>
                                    Your login email address.
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
                                <FormLabel>Post</FormLabel>
                                <FormControl>
                                    <Input type='text' {...field} readOnly />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='space-y-4 rounded-lg border p-4'>
                    <h3 className='text-lg font-medium'>Change Password</h3>
                    <div className='grid gap-4 md:grid-cols-2'>
                        <FormField
                            control={form.control}
                            name='currentPassword'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='Current password'
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
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='New password'
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
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='Confirm new password'
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
                            <FormLabel>Role</FormLabel>
                            <div className='pt-1'>
                                <Badge variant='secondary'>
                                    {roleLabels[field.value ?? ''] ??
                                        field.value}
                                </Badge>
                            </div>
                            <FormDescription>
                                Your role determines your access permissions.
                            </FormDescription>
                        </FormItem>
                    )}
                />

                <Button type='submit' disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update profile'}
                </Button>
            </form>
        </Form>
    )
}
