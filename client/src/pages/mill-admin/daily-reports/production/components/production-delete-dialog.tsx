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
import { type ProductionEntry } from '../data/schema'

type ProductionDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: ProductionEntry | null
}

export function ProductionDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: ProductionDeleteDialogProps) {
    const handleDelete = () => {
        toast.promise(sleep(2000), {
            loading: 'Deleting production record...',
            success: () => {
                onOpenChange(false)
                return 'Production record deleted successfully'
            },
            error: 'Failed to delete record',
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete Production Entry?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the production entry for{' '}
                        <strong>
                            {currentRow?.itemName} ({currentRow?.itemType})
                        </strong>
                        ?
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
