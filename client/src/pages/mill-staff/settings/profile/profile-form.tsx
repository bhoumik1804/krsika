import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
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

const defaultValues: Partial<ProfileFormValues> = {
    name: 'shadcn',
    email: 'm@example.com',
    role: 'mill-staff',
    post: 'Accountant',
}

const roleLabels: Record<string, string> = {
    'super-admin': 'Super Admin',
    'mill-admin': 'Mill Admin',
    'mill-staff': 'Mill Staff',
}

export function ProfileForm() {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: 'onChange',
    })

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => showSubmittedData(data))}
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

                <Button type='submit'>Update profile</Button>
            </form>
        </Form>
    )
}
