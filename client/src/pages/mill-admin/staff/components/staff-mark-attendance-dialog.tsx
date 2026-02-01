import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useStaff } from './staff-provider'

export function StaffMarkAttendanceDialog() {
    const { open, setOpen, currentRow } = useStaff()
    const isOpen = open === 'mark-attendance'

    const handleSubmit = () => {
        if (!currentRow) return

        const data = {
            staffId: currentRow._id,
            staffName: currentRow.fullName,
            timestamp: new Date().toLocaleString(),
        }

        showSubmittedData(data, 'Attendance marked for staff member:')
        setOpen(null)
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => setOpen(null)}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Mark Attendance</DialogTitle>
                    <DialogDescription>
                        Mark attendance for{' '}
                        <span className='font-semibold text-foreground'>
                            {currentRow?.fullName}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className='flex flex-col gap-4 py-4'>
                    <p className='text-sm text-muted-foreground'>
                        Attendance marked for today
                    </p>
                </div>

                <DialogFooter>
                    <Button
                        type='button'
                        onClick={handleSubmit}
                        className='w-full'
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
