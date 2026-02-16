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
    const { millId } = useTransporterReport()
    const isEditing = !!currentRow
    const { mutate: createTransporter, isPending: isCreating } =
        useCreateTransporter(millId)
    const { mutate: updateTransporter, isPending: isUpdating } =
        useUpdateTransporter(millId)
    const { t } = useTranslation('mill-staff')

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
                        {isEditing
                            ? t('transporterReport.form.editTitle')
                            : t('transporterReport.form.addTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t(
                                  'transporterReport.form.editDescription'
                              )
                            : t(
                                  'transporterReport.form.addDescription'
                              )}
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
                                                    'transporterReport.form.name'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        'transporterReport.form.placeholders.name'
                                                    )}
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
                                                    'transporterReport.form.gstn'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        'transporterReport.form.placeholders.gstn'
                                                    )}
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
                                                    'transporterReport.form.phone'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        'transporterReport.form.placeholders.phone'
                                                    )}
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
                                                    'transporterReport.form.email'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='email'
                                                    placeholder={t(
                                                        'transporterReport.form.placeholders.email'
                                                    )}
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
                                                    'transporterReport.form.address'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        'transporterReport.form.placeholders.address'
                                                    )}
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
                                        ? t('common.updating')
                                        : t('common.adding')
                                    : isEditing
                                      ? t('common.update')
                                      : t('common.add')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
