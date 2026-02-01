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
import { partyReportSchema, type PartyReportData } from '../data/schema'
import { useCreateParty, useUpdateParty } from '../data/hooks'
import { useUser } from '@/pages/landing/hooks/use-auth'

type PartyReportActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PartyReportData | null
}

export function PartyReportActionDialog({
    open,
    onOpenChange,
    currentRow,
}: PartyReportActionDialogProps) {
    const isEditing = !!currentRow
    const { user } = useUser()
    const millId = user?.millId as any

    const createMutation = useCreateParty(millId)
    const updateMutation = useUpdateParty(millId)
    const isLoading = createMutation.isPending || updateMutation.isPending

    const form = useForm<PartyReportData>({
        resolver: zodResolver(partyReportSchema),
        defaultValues: {
            _id: '',
            id: '',
            partyName: '',
            gstn: '',
            phone: '',
            email: '',
            address: '',
        },
    })

    useEffect(() => {
        if (open) {
            if (currentRow) {
                form.reset(currentRow as any)
            } else {
                form.reset({
                    _id: '',
                    id: '',
                    partyName: '',
                    gstn: '',
                    phone: '',
                    email: '',
                    address: '',
                })
            }
        }
    }, [open, currentRow, form])

    const onSubmit = async (data: any) => {
        try {
            if (isEditing && currentRow?._id) {
                await updateMutation.mutateAsync({ 
                    id: currentRow._id, 
                    partyName: data.partyName,
                    gstn: data.gstn,
                    phone: data.phone,
                    email: data.email,
                    address: data.address,
                })
            } else {
                await createMutation.mutateAsync({
                    partyName: data.partyName,
                    gstn: data.gstn,
                    phone: data.phone,
                    email: data.email,
                    address: data.address,
                })
            }
            onOpenChange(false)
        } catch (error: any) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit' : 'Add'} Party
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update' : 'Enter'} the party details
                        below
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
                                                Party Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter party name'
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
                                            <FormLabel>GSTN</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter GSTN'
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
                                                Phone
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter phone number'
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
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='email'
                                                    placeholder='Enter email'
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
                                        <FormItem className='col-span-2'>
                                            <FormLabel>
                                                Address
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter address'
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
                                Cancel
                            </Button>
                            <Button 
                                type='submit'
                                disabled={isLoading}
                            >
                                {isLoading 
                                    ? (isEditing ? 'Updating...' : 'Adding...') 
                                    : (isEditing ? 'Update' : 'Add') 
                                } Party
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}