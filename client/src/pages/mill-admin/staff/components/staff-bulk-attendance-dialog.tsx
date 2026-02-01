import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useStaff } from './staff-provider'

export function StaffBulkAttendanceDialog() {
    const { open, setOpen } = useStaff()
    const isOpen = open === 'bulk-attendance'

    return (
        <Dialog open={isOpen} onOpenChange={() => setOpen(null)}>
            <DialogContent className='max-h-[600px] max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>Bulk Mark Attendance</DialogTitle>
                    <DialogDescription>
                        Bulk attendance marking feature coming soon
                    </DialogDescription>
                </DialogHeader>

                <div className='flex flex-col gap-4 py-4'>
                    <p className='text-center text-sm text-muted-foreground'>
                        This feature will be available soon
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
