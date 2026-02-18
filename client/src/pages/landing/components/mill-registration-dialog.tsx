'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
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
import { useRegisterMill } from '../data/hooks'
import { useUser } from '../hooks'

const formSchema = z.object({
    millName: z
        .string()
        .min(1, 'Mill name is required')
        .max(200, 'Mill name is too long'),
    contact: z.object({
        email: z.string().email('Invalid email address'),
        phone: z
            .string()
            .min(10, 'Phone number must be at least 10 digits')
            .max(15, 'Phone number must be at most 15 digits'),
        address: z
            .string()
            .min(1, 'Address is required')
            .max(500, 'Address is too long'),
        city: z
            .string()
            .min(1, 'City is required')
            .max(100, 'City name is too long'),
        state: z
            .string()
            .min(1, 'State is required')
            .max(100, 'State name is too long'),
        pincode: z
            .string()
            .regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
    }),
    millInfo: z.object({
        gstNumber: z
            .string()
            .length(15, 'GST number must be exactly 15 characters')
            .regex(
                /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                'Invalid GST number format'
            ),
        panNumber: z
            .string()
            .length(10, 'PAN number must be exactly 10 characters')
            .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number format'),
        mnmNumber: z
            .string()
            .trim()
            .length(8, 'MNM number must be exactly 8 characters')
            .regex(
                /^[A-Z]{2}\d{6}$/,
                'MNM number must contain 2 uppercase letters followed by 6 digits (e.g., MA432447)'
            ),
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
    const { user } = useUser()
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
                email: user?.email ?? '',
                phone: '',
                address: '',
                city: '',
                state: '',
                pincode: '',
            },
            millInfo: {
                gstNumber: '',
                panNumber: '',
                mnmNumber: '',
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
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
                            <FormField
                                control={form.control}
                                name='millInfo.gstNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>GST Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='enter GST number'
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
                                                placeholder='enter PAN number'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='millInfo.mnmNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>MNM Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='enter MNM number'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='contact.email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='email'
                                                placeholder='enter email address'
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
                                                placeholder='enter phone number'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='contact.address'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='enter mill address'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='contact.city'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='enter city name'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='contact.state'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='enter state name'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='contact.pincode'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pincode</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='enter pincode'
                                                maxLength={6}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type='submit'
                                disabled={registerMill.isPending}
                            >
                                {registerMill.isPending ? (
                                    <>
                                        <Loader2 className='h-4 w-4 animate-spin' />
                                        Registering...
                                    </>
                                ) : (
                                    'Register'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
