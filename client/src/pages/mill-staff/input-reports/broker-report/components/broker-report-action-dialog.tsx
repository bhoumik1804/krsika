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
import { useCreateBroker, useUpdateBroker } from '../data/hooks'
import { brokerReportSchema, type BrokerReportData } from '../data/schema'
import { useBrokerReport } from './broker-report-provider'

type BrokerReportActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: BrokerReportData
}

export function BrokerReportActionDialog({
    open,
    onOpenChange,
    currentRow,
}: BrokerReportActionDialogProps) {
    const { millId } = useBrokerReport()
    const { mutate: createBroker, isPending: isCreating } =
        useCreateBroker(millId)
    const { mutate: updateBroker, isPending: isUpdating } =
        useUpdateBroker(millId)

    const isEditing = !!currentRow
    const isLoading = isCreating || isUpdating

    const form = useForm<BrokerReportData>({
        resolver: zodResolver(brokerReportSchema),
        defaultValues: isEditing
            ? { ...currentRow }
            : {
                  brokerName: '',
                  phone: '',
                  email: '',
                  address: '',
              },
    })

    useEffect(() => {
        if (open) {
            form.reset(
                isEditing
                    ? { ...currentRow }
                    : {
                          brokerName: '',
                          phone: '',
                          email: '',
                          address: '',
                      }
            )
        }
    }, [open])

    const onSubmit = (data: BrokerReportData) => {
        if (isEditing) {
            updateBroker(
                { brokerId: currentRow._id || '', data },
                {
                    onSuccess: () => {
                        onOpenChange(false)
                        form.reset()
                    },
                }
            )
        } else {
            createBroker(data, {
                onSuccess: () => {
                    onOpenChange(false)
                    form.reset()
                },
            })
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                form.reset()
                onOpenChange(state)
            }}
        >
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
                                            <FormLabel>Broker Name</FormLabel>
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
                                            <FormLabel>Phone</FormLabel>
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
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
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
                                {isLoading
                                    ? isEditing
                                        ? 'Updating...'
                                        : 'Adding...'
                                    : isEditing
                                      ? 'Update'
                                      : 'Add'}{' '}
                                Broker
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
