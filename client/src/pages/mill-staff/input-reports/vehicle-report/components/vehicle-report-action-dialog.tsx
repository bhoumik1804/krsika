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
import { vehicleReportSchema, type VehicleReportData } from '../data/schema'

type VehicleReportActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: VehicleReportData | null
}

export function VehicleReportActionDialog({
    open,
    onOpenChange,
    currentRow,
}: VehicleReportActionDialogProps) {
    const isEditing = !!currentRow

    const form = useForm<VehicleReportData>({
        resolver: zodResolver(vehicleReportSchema),
        defaultValues: {
            truckNo: '',
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
            loading: isEditing ? 'Updating vehicle...' : 'Adding vehicle...',
            success: () => {
                onOpenChange(false)
                form.reset()
                return isEditing
                    ? 'Vehicle updated successfully'
                    : 'Vehicle added successfully'
            },
            error: isEditing
                ? 'Failed to update vehicle'
                : 'Failed to add vehicle',
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-md'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit' : 'Add'} Vehicle
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update' : 'Enter'} the vehicle details
                        below
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <FormField
                            control={form.control}
                            name='truckNo'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Truck Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter truck number'
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
                                {isEditing ? 'Update' : 'Add'} Vehicle
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
