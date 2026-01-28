'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
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
import { Textarea } from '@/components/ui/textarea'
import { type SubscriptionPlan } from '../data/plans'
import { formSchema, type SubscriptionForm } from '../data/schema'

type SubscriptionActionDialogProps = {
    currentRow?: SubscriptionPlan
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SubscriptionActionDialog({
    currentRow,
    open,
    onOpenChange,
}: SubscriptionActionDialogProps) {
    const isEdit = !!currentRow
    const form = useForm<SubscriptionForm>({
        resolver: zodResolver(formSchema),
        defaultValues: isEdit
            ? {
                  name: currentRow.name,
                  description: currentRow.description,
                  price: currentRow.price,
                  duration: currentRow.duration,
                  features: currentRow.features.join('\n'),
              }
            : {
                  name: '',
                  description: '',
                  price: '',
                  duration: '',
                  features: '',
              },
    })

    // Update form values when currentRow changes (e.g. when opening for a different plan)
    if (currentRow && form.getValues('name') !== currentRow.name && open) {
        form.reset({
            name: currentRow.name,
            description: currentRow.description,
            price: currentRow.price,
            duration: currentRow.duration,
            features: currentRow.features.join('\n'),
        })
    }

    const onSubmit = (values: SubscriptionForm) => {
        const formattedValues = {
            ...values,
            features: values.features
                .split('\n')
                .filter((f) => f.trim() !== ''),
        }
        form.reset()
        showSubmittedData(formattedValues)
        onOpenChange(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                if (!state) form.reset()
                onOpenChange(state)
            }}
        >
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader className='text-start'>
                    <DialogTitle>
                        {isEdit ? 'Edit Subscription Plan' : 'Add New Plan'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update the subscription plan details here. '
                            : 'Create a new subscription plan here. '}
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className='py-4'>
                    <Form {...form}>
                        <form
                            id='subscription-form'
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-4 px-0.5'
                        >
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Plan Name'
                                                className='col-span-4'
                                                autoComplete='off'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Description
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Plan description'
                                                className='col-span-4'
                                                autoComplete='off'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='price'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Price
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='₹0'
                                                className='col-span-4'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='duration'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Duration
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='per month / forever'
                                                className='col-span-4'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='features'
                                render={({ field }) => (
                                    <FormItem className='mt-4 grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 pt-2 text-end'>
                                            Features
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder='Enter features (one per line)'
                                                className='col-span-4'
                                                rows={5}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <Button type='submit' form='subscription-form'>
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
