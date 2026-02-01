import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { brokerReportSchema, type BrokerReportData } from '../data/schema'
import { useCreateBroker, useUpdateBroker } from '../data/hooks'
import { useUser } from '@/pages/landing/hooks/use-auth'

type BrokerReportActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: BrokerReportData | null
}

export function BrokerReportActionDialog({
    open,
    onOpenChange,
    currentRow,
}: BrokerReportActionDialogProps) {
    const isEditing = !!currentRow
    const { user } = useUser()
    const millId = user?.millId as any

    const createMutation = useCreateBroker(millId)
    const updateMutation = useUpdateBroker(millId)
    const isLoading = createMutation.isPending || updateMutation.isPending

    const form = useForm<BrokerReportData>({
        resolver: zodResolver(brokerReportSchema),
        defaultValues: {
            _id: '',
            id: '',
            brokerName: '',
            phone: '',
            email: '',
            address: '',
        },
    })

    useEffect(() => {
        if (open) {
            if (currentRow) {
                form.reset(currentRow as any)
            } else {
                form.reset({
                    _id: '',
                    id: '',
                    brokerName: '',
                    phone: '',
                    email: '',
                    address: '',
                })
            }
        }
    }, [open, currentRow, form])

    const onSubmit = async (data: any) => {
        try {
            if (isEditing && currentRow?._id) {
                await updateMutation.mutateAsync({ 
                    id: currentRow._id, 
                    brokerName: data.brokerName,
                    phone: data.phone,
                    email: data.email,
                    address: data.address,
                })
            } else {
                await createMutation.mutateAsync({
                    brokerName: data.brokerName,
                    phone: data.phone,
                    email: data.email,
                    address: data.address,
                })
            }
            onOpenChange(false)
        } catch (error: any) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit' : 'Add'} Broker
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update' : 'Enter'} the broker details
                        below
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <div className='space-y-6'>
                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='brokerName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Broker Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter broker name'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='phone'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Phone
                                            </FormLabel>
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
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='email'
                                                    placeholder='Enter email'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='address'
                                    render={({ field }) => (
                                        <FormItem className='col-span-2'>
                                            <FormLabel>
                                                Address
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter address'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type='submit' disabled={isLoading}>
                                {isLoading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update' : 'Add')} Broker
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
