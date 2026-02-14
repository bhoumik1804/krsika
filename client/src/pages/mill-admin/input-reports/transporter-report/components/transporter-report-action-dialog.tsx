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
import { useCreateTransporter, useUpdateTransporter } from '../data/hooks'
import {
    transporterReportSchema,
    type TransporterReportData,
} from '../data/schema'
import { useTransporterReport } from './transporter-report-provider'

type TransporterReportActionDialogProps = {
    currentRow?: TransporterReportData
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function TransporterReportActionDialog({
    currentRow,
    open,
    onOpenChange,
}: TransporterReportActionDialogProps) {
    const { millId } = useTransporterReport()
    const isEditing = !!currentRow
    const { mutate: createTransporter, isPending: isCreating } =
        useCreateTransporter(millId)
    const { mutate: updateTransporter, isPending: isUpdating } =
        useUpdateTransporter(millId, currentRow?._id || '')

    const isLoading = isCreating || isUpdating

    const form = useForm<TransporterReportData>({
        resolver: zodResolver(transporterReportSchema),
        defaultValues: isEditing
            ? { ...currentRow }
            : {
                  transporterName: '',
                  gstn: '',
                  phone: '',
                  email: '',
                  address: '',
              },
    })

    const onSubmit = (data: TransporterReportData) => {
        if (isEditing) {
            updateTransporter(data, {
                onSuccess: () => {
                    form.reset()
                    onOpenChange(false)
                },
            })
        } else {
            createTransporter(data, {
                onSuccess: () => {
                    form.reset()
                    onOpenChange(false)
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
                        {isEditing ? 'Edit' : 'Add'} Transporter
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update' : 'Enter'} the transporter details
                        below
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        id='transporter-form'
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <div className='space-y-6'>
                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='transporterName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Transporter Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter transporter name'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='gstn'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>GSTN</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter GSTN'
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
                                disabled={isLoading}
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
                                Transporter
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
