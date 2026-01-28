import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
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
    const isEditing = !!currentRow

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

    const onSubmit = () => {
        toast.promise(sleep(2000), {
            loading: isEditing
                ? 'Updating labour group...'
                : 'Adding labour group...',
            success: () => {
                onOpenChange(false)
                form.reset()
                return isEditing
                    ? 'Labour group updated successfully'
                    : 'Labour group added successfully'
            },
            error: isEditing
                ? 'Failed to update labour group'
                : 'Failed to add labour group',
        })
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
                            >
                                Cancel
                            </Button>
                            <Button type='submit'>
                                {isEditing ? 'Update' : 'Add'} Labour Group
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
