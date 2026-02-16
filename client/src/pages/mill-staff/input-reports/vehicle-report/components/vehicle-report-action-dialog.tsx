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
import { useCreateVehicle, useUpdateVehicle } from '../data/hooks'
import { vehicleReportSchema, type VehicleReportData } from '../data/schema'
import { useVehicleReport } from './vehicle-report-provider'

type VehicleReportActionDialogProps = {
    currentRow?: VehicleReportData
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function VehicleReportActionDialog({
    currentRow,
    open,
    onOpenChange,
}: VehicleReportActionDialogProps) {
    const { millId } = useVehicleReport()
    const isEditing = !!currentRow
    const { mutate: createVehicle, isPending: isCreating } =
        useCreateVehicle(millId)
    const { mutate: updateVehicle, isPending: isUpdating } =
        useUpdateVehicle(millId)

    const { t } = useTranslation('mill-staff')

    const isLoading = isCreating || isUpdating

    const form = useForm<VehicleReportData>({
        resolver: zodResolver(vehicleReportSchema),
        defaultValues: isEditing
            ? { ...currentRow }
            : {
                  truckNo: '',
              },
    })

    const onSubmit = (data: VehicleReportData) => {
        const vehicleId = currentRow?._id
        if (isEditing && vehicleId) {
            updateVehicle(
                { vehicleId, data },
                {
                    onSuccess: () => {
                        form.reset()
                        onOpenChange(false)
                    },
                }
            )
        } else {
            createVehicle(data, {
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
                            ? t('inputReports.vehicleReport.form.editTitle')
                            : t('inputReports.vehicleReport.form.addTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t(
                                  'inputReports.vehicleReport.form.editDescription'
                              )
                            : t(
                                  'inputReports.vehicleReport.form.addDescription'
                              )}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <div className='space-y-6'>
                            <div className='grid grid-cols-1 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='truckNo'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'inputReports.vehicleReport.form.truckNo'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        'inputReports.vehicleReport.form.placeholders.truckNo'
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
