import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
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
    const { t } = useTranslation('mill-staff')
    const { millId } = useTransporterReport()
    const isEditing = !!currentRow
    const { mutate: createTransporter, isPending: isCreating } =
        useCreateTransporter(millId)
    const { mutate: updateTransporter, isPending: isUpdating } =
        useUpdateTransporter(millId)

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
        const transporterId = currentRow?._id
        if (isEditing && transporterId) {
            updateTransporter(
                { transporterId, data },
                {
                    onSuccess: () => {
                        form.reset()
                        onOpenChange(false)
                    },
                }
            )
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
                        {isEditing ? t('common.edit') : t('common.add')}{' '}
                        {t('inputReports.transporter.form.title')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('common.enter')}{' '}
                        {t(
                            'inputReports.transporter.form.description'
                        ).toLowerCase()}
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
                                                {t(
                                                    'inputReports.transporter.form.fields.transporterName'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Transporter Name'
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
                                            <FormLabel>
                                                {t(
                                                    'inputReports.transporter.form.fields.gstn'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='GSTN'
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
                                                {t(
                                                    'inputReports.transporter.form.fields.phone'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Phone No.'
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
                                            <FormLabel>
                                                {t(
                                                    'inputReports.transporter.form.fields.email'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='email'
                                                    placeholder='Email'
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
                                            <FormLabel>
                                                {t(
                                                    'inputReports.transporter.form.fields.address'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Address'
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
                                {t('common.cancel')}
                            </Button>
                            <Button type='submit' disabled={isLoading}>
                                {isLoading
                                    ? isEditing
                                        ? t('common.update') + '...'
                                        : t('common.add') + '...'
                                    : isEditing
                                      ? t('common.update')
                                      : t('common.add')}{' '}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
