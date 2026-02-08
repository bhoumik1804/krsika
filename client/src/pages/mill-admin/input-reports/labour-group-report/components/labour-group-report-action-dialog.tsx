import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'react-router'
import { toast } from 'sonner'
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
import { useCreateLabourGroup, useUpdateLabourGroup } from '../data/hooks'
import {
    labourGroupReportSchema,
    type LabourGroupReportData,
} from '../data/schema'

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
    const { millId } = useParams<{ millId: string }>()
    const isEditing = !!currentRow
    const createMutation = useCreateLabourGroup(millId || '')
    const updateMutation = useUpdateLabourGroup(millId || '')
    const isLoading = createMutation.isPending || updateMutation.isPending

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
            form.reset({
                labourTeamName: '',
            })
        }
    }, [currentRow, form])

    const onSubmit = async (data: LabourGroupReportData) => {
        try {
            if (!millId) {
                toast.error('Mill ID not found')
                return
            }

            // Transform labourTeamName to groupName for API
            const payload = {
                groupName: data.labourTeamName,
            }

            if (currentRow?._id) {
                await updateMutation.mutateAsync({
                    id: currentRow._id,
                    ...payload,
                })
            } else {
                await createMutation.mutateAsync(payload)
            }
            onOpenChange(false)
            form.reset({
                labourTeamName: '',
            })
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'An error occurred'
            toast.error(errorMessage)
            console.error('Error submitting form:', error)
        }
    }

    const handleDialogClose = (isOpen: boolean) => {
        if (!isOpen) {
            form.reset({
                labourTeamName: '',
            })
        }
        onOpenChange(isOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
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
                                            disabled={isLoading}
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
                                onClick={() => handleDialogClose(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type='submit' disabled={isLoading}>
                                {isLoading
                                    ? 'Loading...'
                                    : isEditing
                                      ? 'Update Labour Group'
                                      : 'Add Labour Group'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
