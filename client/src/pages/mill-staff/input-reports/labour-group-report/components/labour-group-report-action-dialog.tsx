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
import {
    labourGroupReportSchema,
    type LabourGroupReportData,
} from '../data/schema'
import { useCreateLabourGroup, useUpdateLabourGroup } from '../data/hooks'
import { useUser } from '@/pages/landing/hooks/use-auth'

type LabourGroupReportActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: LabourGroupReportData | null
}

export function LabourGroupReportActionDialog({
    open,
    onOpenChange,
    currentRow,
}: LabourGroupReportActionDialogProps) {
    const { user } = useUser()
    const millId = user?.millId as any
    const createMutation = useCreateLabourGroup(millId)
    const updateMutation = useUpdateLabourGroup(millId)
    const isLoading = createMutation.isPending || updateMutation.isPending
    const isEditing = !!currentRow?._id

    const form = useForm<LabourGroupReportData>({
        resolver: zodResolver(labourGroupReportSchema),
        defaultValues: {
            labourTeamName: '',
        },
    })

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset()
        }
    }, [currentRow, form])

    const onSubmit = async (data: LabourGroupReportData) => {
        try {
            if (isEditing && currentRow?._id) {
                await updateMutation.mutateAsync({
                    id: currentRow._id,
                    ...data,
                })
            } else {
                await createMutation.mutateAsync(data)
            }
            onOpenChange(false)
            form.reset()
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-md'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit' : 'Add'} Labour Group
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update' : 'Enter'} the labour group
                        details below
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <FormField
                            control={form.control}
                            name='labourTeamName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Labour Team Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter labour team name'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                      : 'Add'} Labour Group
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
