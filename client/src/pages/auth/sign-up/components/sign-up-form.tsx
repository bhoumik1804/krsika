import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignup, useGoogleLogin } from '@/pages/landing/hooks/use-auth'
import { Loader2, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { IconGoogle } from '@/assets/brand-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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

const formSchema = z
    .object({
        fullName: z
            .string()
            .min(1, 'Please enter your full name')
            .max(100, 'Name is too long'),
        email: z.email({
            error: (iss) =>
                iss.input === '' ? 'Please enter your email' : undefined,
        }),
        password: z
            .string()
            .min(1, 'Please enter your password')
            .min(6, 'Password must be at least 6 characters long'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match.",
        path: ['confirmPassword'],
    })

export function SignUpForm({
    className,
    ...props
}: React.HTMLAttributes<HTMLFormElement>) {
    const navigate = useNavigate()
    const { signup, isLoading } = useSignup()
    const { login: googleLogin } = useGoogleLogin()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        signup(
            {
                fullName: data.fullName,
                email: data.email,
                password: data.password,
            },
            {
                onSuccess: () => {
                    navigate('/', { replace: true })
                    toast.success('Account created successfully!')
                },
                onError: (err: any) => {
                    toast.error(err?.response?.data?.message || 'Signup failed')
                },
            }
        )
    }

    function handleGoogleLogin() {
        googleLogin()
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn('grid gap-3', className)}
                {...props}
            >
                <FormField
                    control={form.control}
                    name='fullName'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='enter your full name'
                                    {...field}
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
                                    placeholder='name@example.com'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder='********'
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
                                <PasswordInput
                                    placeholder='********'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className='mt-2' disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className='animate-spin' />
                    ) : (
                        <UserPlus />
                    )}
                    Create Account
                </Button>

                <div className='relative my-2'>
                    <div className='absolute inset-0 flex items-center'>
                        <span className='w-full border-t' />
                    </div>
                    <div className='relative flex justify-center text-xs uppercase'>
                        <span className='bg-background px-2 text-muted-foreground'>
                            Or continue with
                        </span>
                    </div>
                </div>

                <Button
                    variant='outline'
                    className='w-full'
                    type='button'
                    disabled={isLoading}
                    onClick={handleGoogleLogin}
                >
                    <IconGoogle className='h-4 w-4' /> Google
                </Button>
            </form>
        </Form>
    )
}
