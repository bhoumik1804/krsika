import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useUser, useUpdateProfile } from '@/pages/landing/hooks'
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

const profileFormSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters.')
        .max(30, 'Name must not be longer than 30 characters.'),
    email: z.string().email('Please enter a valid email.'),
    role: z.string().optional(),
    post: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>




const roleLabels: Record<string, string> = {
    'super-admin': 'Super Admin',
    'mill-admin': 'Mill Admin',
    'mill-staff': 'Mill Staff',
}

export function ProfileForm() {
    const { user } = useUser()
    const { updateProfileAsync, isLoading } = useUpdateProfile()

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user?.fullName || '',
            email: user?.email || '',
            role: user?.role || '',
            post: user?.post || '', // Assuming 'post' is available on user object or handled similarly
        },
        mode: 'onChange',
    })

    async function onSubmit(data: ProfileFormValues) {
        try {
            await updateProfileAsync({
                fullName: data.name,
                // post update might need backend support if it's editable
            })
            toast.success('Profile updated successfully')
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
