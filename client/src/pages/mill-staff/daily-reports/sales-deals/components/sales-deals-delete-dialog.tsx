import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { type SalesDeal } from '../data/schema'

type SalesDealsDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: SalesDeal | null
}

export function SalesDealsDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: SalesDealsDeleteDialogProps) {
    const handleDelete = () => {
        toast.promise(sleep(2000), {
            loading: 'Deleting sales deal...',
            success: () => {
                onOpenChange(false)
                return 'Sales deal deleted successfully'
            },
            error: 'Failed to delete sales deal',
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Sales Deal?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this sales deal for{' '}
                        <strong>{currentRow?.buyerName}</strong>?
                        <br />
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
