import { toast } from 'sonner'
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
import { useOtherInward } from './other-inward-provider'

type OtherInwardDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OtherInwardDeleteDialog({
    open,
    onOpenChange,
}: OtherInwardDeleteDialogProps) {
    const { currentRow } = useOtherInward()

    const handleDelete = () => {
        toast.success(`Record for ${currentRow?.itemName} deleted successfully`)
        onOpenChange(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the record for{' '}
                        <span className='font-bold'>
                            {currentRow?.itemName}
                        </span>
                        .
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className='bg-red-500 hover:bg-red-600'
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
