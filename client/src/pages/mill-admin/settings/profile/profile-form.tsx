import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useUser, useUpdateProfile } from '@/pages/landing/hooks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    millInfo: z.array(
        z.object({
            name: z.string().min(2, 'Mill name is required.'),
            address: z.string().min(5, 'Address is required.'),
            otherInfo: z.string().optional(),
            id: z.string(),
        })
    ),
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
            millInfo: [
                {
                    name: 'Main Mill',
                    address: '123 Mill Road, Industrial Area',
                    otherInfo: 'Primary processing unit',
                    id: user?.millId || '',
                },
            ],
        },
        mode: 'onChange',
    })

    async function onSubmit(data: ProfileFormValues) {
        try {
            await updateProfileAsync({
                fullName: data.name,
                // mill info update logic might need separate API/handling if supported
            })
            toast.success('Profile updated successfully')
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile')
        }
    }
    const { fields } = useFieldArray({
        name: 'millInfo',
        control: form.control,
    })
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
                <div className='space-y-4'>
                    <div>
                        <h3 className='text-lg font-medium'>
                            Mill Information
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                            Mills associated with your account.
                        </p>
                    </div>
                    {fields.map((field, index) => (
                        <Card key={field.id}>
                            <CardHeader className='pb-2'>
                                <CardTitle className='text-sm font-medium'>
                                    Mill #{index + 1}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='grid gap-4'>
                                <div className='grid gap-4 md:grid-cols-2'>
                                    <FormField
                                        control={form.control}
                                        name={`millInfo.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mill Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='Enter mill name'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`millInfo.${index}.id`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mill ID</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled
                                                        className='bg-muted'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name={`millInfo.${index}.address`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter mill address'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`millInfo.${index}.otherInfo`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Other Information
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Additional details'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Button type='submit' disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update profile'}
                </Button>
            </form>
        </Form>
    )
}
