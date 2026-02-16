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
import { useCreateParty, useUpdateParty } from '../data/hooks'
import { partyReportSchema, type PartyReportData } from '../data/schema'
import { usePartyReport } from './party-report-provider'

type PartyReportActionDialogProps = {
    currentRow?: PartyReportData
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PartyReportActionDialog({
    currentRow,
    open,
    onOpenChange,
}: PartyReportActionDialogProps) {
    const { millId } = usePartyReport()
    const isEditing = !!currentRow
    const { mutate: createParty, isPending: isCreating } =
        useCreateParty(millId)
    const { mutate: updateParty, isPending: isUpdating } =
        useUpdateParty(millId)
    const { t } = useTranslation('mill-staff')

    const isLoading = isCreating || isUpdating

    const form = useForm<PartyReportData>({
        resolver: zodResolver(partyReportSchema),
        defaultValues: isEditing
            ? { ...currentRow }
            : {
                  partyName: '',
                  gstn: '',
                  phone: '',
                  email: '',
                  address: '',
              },
    })

    const onSubmit = (data: PartyReportData) => {
        const partyId = currentRow?._id
        if (isEditing && partyId) {
            updateParty(
                { partyId, data },
                {
                    onSuccess: () => {
                        form.reset()
                        onOpenChange(false)
                    },
                }
            )
        } else {
            createParty(data, {
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
                            ? t('partyReport.form.editTitle')
                            : t('partyReport.form.addTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t('partyReport.form.editDescription')
                            : t('partyReport.form.addDescription')}
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
                                    name='partyName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'partyReport.form.name'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        'partyReport.form.placeholders.name'
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
                                                    'partyReport.form.gstn'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        'partyReport.form.placeholders.gstn'
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
                                                    'partyReport.form.phone'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        'partyReport.form.placeholders.phone'
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
                                                    'partyReport.form.email'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='email'
                                                    placeholder={t(
                                                        'partyReport.form.placeholders.email'
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
                                                    'partyReport.form.address'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        'partyReport.form.placeholders.address'
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
