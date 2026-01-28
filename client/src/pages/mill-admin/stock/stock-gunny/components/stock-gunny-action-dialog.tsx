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
import { stockGunnySchema, type StockGunny } from '../data/schema'

type StockGunnyActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: StockGunny | null
}

export function StockGunnyActionDialog({
    open,
    onOpenChange,
    currentRow,
}: StockGunnyActionDialogProps) {
    const isEditing = !!currentRow

    const form = useForm<StockGunny>({
        resolver: zodResolver(stockGunnySchema),
        defaultValues: {
            filledNew: 0,
            filledOld: 0,
            filledPlastic: 0,
            emptyNew: 0,
            emptyOld: 0,
            emptyPlastic: 0,
        },
    })

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset({
                filledNew: 0,
                filledOld: 0,
                filledPlastic: 0,
                emptyNew: 0,
                emptyOld: 0,
                emptyPlastic: 0,
            })
        }
    }, [currentRow, form])

    const onSubmit = () => {
        toast.promise(sleep(2000), {
            loading: isEditing ? 'Updating...' : 'Adding...',
            success: () => {
                onOpenChange(false)
                form.reset()
                return isEditing ? 'Updated successfully' : 'Added successfully'
            },
            error: isEditing ? 'Failed to update' : 'Failed to add',
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit' : 'Add'} Gunny Stock
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update' : 'Enter'} the details below
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
                                name='filledNew'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Filled (New)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='filledOld'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Filled (Old)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='filledPlastic'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Filled (Plastic)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='emptyNew'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Empty (New)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='emptyOld'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Empty (Old)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='emptyPlastic'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Empty (Plastic)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        +e.target.value
                                                    )
                                                }
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
                            >
                                Cancel
                            </Button>
                            <Button type='submit'>
                                {isEditing ? 'Update' : 'Add'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
