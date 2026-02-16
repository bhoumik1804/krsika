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
import { useCreateStaff, useUpdateStaff } from '../data/hooks'
import { staffReportSchema, type StaffReportData } from '../data/schema'
import { useStaffReport } from './staff-report-provider'

type StaffReportActionDialogProps = {
    currentRow?: StaffReportData
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function StaffReportActionDialog({
    currentRow,
    open,
    onOpenChange,
}: StaffReportActionDialogProps) {
    const { millId } = useStaffReport()
    const { t } = useTranslation('mill-staff')
    const isEditing = !!currentRow
    const { mutate: createStaff, isPending: isCreating } =
        useCreateStaff(millId)
    const { mutate: updateStaff, isPending: isUpdating } =
        useUpdateStaff(millId)

    const isLoading = isCreating || isUpdating

    const form = useForm<StaffReportData>({
        resolver: zodResolver(staffReportSchema),
        defaultValues: isEditing
            ? { ...currentRow }
            : {
                  fullName: '',
                  post: '',
                  salary: '' as unknown as number,
                  phoneNumber: '',
                  email: '',
                  address: '',
              },
    })

    const onSubmit = (formData: StaffReportData) => {
        const { _id, ...data } = formData
        const staffId = currentRow?._id
        if (isEditing && staffId) {
            updateStaff(
                { staffId, data },
                {
                    onSuccess: () => {
                        form.reset()
                        onOpenChange(false)
                    },
                }
            )
        } else {
            createStaff(data, {
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
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t('inputReports.staffReport.form.editTitle')
                            : t('inputReports.staffReport.form.addTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t('inputReports.staffReport.form.editDescription')
                            : t('inputReports.staffReport.form.addDescription')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <div className='grid grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name='fullName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'inputReports.staffReport.form.fullName'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'inputReports.staffReport.form.placeholders.name'
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
                                name='post'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'inputReports.staffReport.form.post'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'inputReports.staffReport.form.placeholders.post'
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
                                name='salary'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'inputReports.staffReport.form.salary'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                placeholder={t(
                                                    'inputReports.staffReport.form.placeholders.salary'
                                                )}
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val =
                                                        e.target.valueAsNumber
                                                    field.onChange(
                                                        isNaN(val)
                                                            ? undefined
                                                            : val
                                                    )
                                                }}
                                                onWheel={(e) =>
                                                    e.currentTarget.blur()
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='phoneNumber'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'inputReports.staffReport.form.phone'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='tel'
                                                placeholder={t(
                                                    'inputReports.staffReport.form.placeholders.phone'
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
                                                'inputReports.staffReport.form.email'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='email'
                                                placeholder={t(
                                                    'inputReports.staffReport.form.placeholders.email'
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
                                                'inputReports.staffReport.form.address'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    'inputReports.staffReport.form.placeholders.address'
                                                )}
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
