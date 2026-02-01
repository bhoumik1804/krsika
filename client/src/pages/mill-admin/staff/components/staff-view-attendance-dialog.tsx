import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useStaff } from './staff-provider'

export function StaffViewAttendanceDialog() {
    const { open, setOpen, currentRow } = useStaff()
    const isOpen = open === 'view-attendance'

    return (
        <Dialog open={isOpen} onOpenChange={() => setOpen(null)}>
            <DialogContent className='max-h-[600px] max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>Attendance History</DialogTitle>
                    <DialogDescription>
                        Viewing attendance history for{' '}
                        <span className='font-semibold text-foreground'>
                            {currentRow?.fullName}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className='flex flex-col gap-4 py-4'>
                    <p className='text-center text-sm text-muted-foreground'>
                        Attendance tracking feature coming soon
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
