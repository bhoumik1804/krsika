'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Textarea } from '@/components/ui/textarea'
import { useRegisterMill } from '../data/hooks'

const formSchema = z.object({
    millName: z
        .string()
        .min(1, 'Mill name is required')
        .max(200, 'Mill name is too long'),
    contact: z.object({
        email: z
            .string()
            .email('Invalid email address')
            .max(255, 'Email is too long'),
        phone: z
            .string()
            .min(10, 'Phone number must be at least 10 digits')
            .max(20, 'Phone number must be at most 20 digits'),
        address: z.string().max(500, 'Address is too long').optional(),
    }),
    millInfo: z.object({
        gstNumber: z
            .string()
            .length(15, 'GST number must be exactly 15 characters'),
        panNumber: z
            .string()
            .length(10, 'PAN number must be exactly 10 characters'),
    }),
})

type FormValues = z.infer<typeof formSchema>

interface MillRegistrationDialogProps {
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function MillRegistrationDialog({
    trigger,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
}: MillRegistrationDialogProps) {
    const { user } = useAuthStore()
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? setControlledOpen : setInternalOpen

    const registerMill = useRegisterMill()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            millName: '',
            contact: {
                email: user?.email || '',
                phone: '',
                address: '',
            },
            millInfo: {
                gstNumber: '',
                panNumber: '',
            },
        },
    })

    function onSubmit(data: FormValues) {
        registerMill.mutate(data, {
            onSuccess: () => {
                setOpen?.(false)
                form.reset()
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className='sm:max-w-[600px]'>
                <DialogHeader>
                    <DialogTitle>Register Your Mill</DialogTitle>
                    <DialogDescription>
                        Register your mill to get started. We'll verify your
                        details and activate your account.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <FormField
                            control={form.control}
                            name='millName'
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

                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <FormField
                                control={form.control}
                                name='millInfo.gstNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>GST Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter GST number'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='millInfo.panNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>PAN Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter PAN number'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <FormField
                                control={form.control}
                                name='contact.email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='email'
                                                placeholder='Enter email address'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='contact.phone'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter phone number'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name='contact.address'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='Enter full address'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type='submit'
                                disabled={registerMill.isPending}
                            >
                                {registerMill.isPending
                                    ? 'Registering...'
                                    : 'Register'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
