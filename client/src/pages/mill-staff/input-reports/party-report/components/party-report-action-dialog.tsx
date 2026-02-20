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
    const { t } = useTranslation('mill-staff')
    const { millId } = usePartyReport()
    const isEditing = !!currentRow
    const { mutate: createParty, isPending: isCreating } =
        useCreateParty(millId)
    const { mutate: updateParty, isPending: isUpdating } =
        useUpdateParty(millId)

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
                            ? t('common.edit') +
                              ' ' +
                              t('inputReports.party.title').replace(
                                  ' Report',
                                  ''
                              )
                            : t('inputReports.party.form.title')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t('common.update') +
                              ' ' +
                              t('inputReports.party.title').replace(
                                  ' Report',
                                  ''
                              )
                            : t('inputReports.party.form.description')}
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
                                                    'inputReports.party.form.fields.partyName'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Party Name'
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
                                                    'inputReports.party.form.fields.gstn'
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
                                                    'inputReports.party.form.fields.phone'
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
                                                    'inputReports.party.form.fields.email'
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
                                                    'inputReports.party.form.fields.address'
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
                                      : t('common.add')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
