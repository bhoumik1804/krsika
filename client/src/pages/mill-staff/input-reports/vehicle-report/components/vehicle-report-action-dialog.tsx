import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUser } from '@/pages/landing/hooks/use-auth'
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
    const { user } = useUser()
    const millId = user?.millId as any
    const createMutation = useCreateVehicle(millId)
    const updateMutation = useUpdateVehicle(millId)
    const isLoading = createMutation.isPending || updateMutation.isPending
    const isEditing = !!currentRow?._id

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

    const onSubmit = async (data: VehicleReportData) => {
        try {
            if (isEditing && currentRow?._id) {
                await updateMutation.mutateAsync({
                    id: currentRow._id,
                    ...data,
                })
            } else {
                const { _id, id, ...createData } = data
                await createMutation.mutateAsync(createData)
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
                                      : 'Add'}{' '}
                                Vehicle
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
