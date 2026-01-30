import { useMemo, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar, CalendarDayButton } from '@/components/ui/calendar'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { type Staff, type AttendanceStatus } from '../data/schema'
import { useStaff } from './staff-provider'

type StaffViewAttendanceDialogProps = {
    open: boolean
    onOpenChange: () => void
    currentRow: Staff
}

export function StaffViewAttendanceDialog({
    open,
    onOpenChange,
    currentRow,
}: StaffViewAttendanceDialogProps) {
    const { setOpen } = useStaff()
    const [month, setMonth] = useState<Date>(new Date())
    const attendanceData = currentRow.attendanceHistory || []

    const attendanceMap = useMemo(() => {
        const map = new Map<string, AttendanceStatus>()
        attendanceData.forEach((record) => {
            map.set(record.date, record.status)
        })
        return map
    }, [attendanceData])

    // Get attendance for a specific date
    const getAttendanceForDate = (date: Date): AttendanceStatus | null => {
        const dateStr = date.toISOString().split('T')[0]
        return attendanceMap.get(dateStr) || null
    }

    const AttendanceDayButton = ({
        children,
        modifiers,
        day,
        ...props
    }: React.ComponentProps<typeof CalendarDayButton>) => {
        const status = getAttendanceForDate(day.date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const currentDate = new Date(day.date)
        currentDate.setHours(0, 0, 0, 0)
        const isPastDate = currentDate < today

        return (
            <CalendarDayButton
                day={day}
                modifiers={modifiers}
                {...props}
                className={cn(props.className)}
            >
                <div className='flex flex-col items-center justify-center gap-1'>
                    <span className='text-sm leading-none font-semibold'>
                        {day.date.getDate()}
                    </span>
                    {!modifiers.outside && (
                        <span
                            className={cn(
                                'text-xs font-medium tracking-wider whitespace-nowrap uppercase',
                                status === 'P' &&
                                    'text-green-700 dark:text-green-300',
                                status === 'H' &&
                                    'text-orange-700 dark:text-orange-300',
                                status === 'A' &&
                                    'text-red-700 dark:text-red-300',
                                !status && 'text-muted-foreground/50'
                            )}
                        >
                            {status || (isPastDate ? 'N' : '')}
                        </span>
                    )}
                </div>
            </CalendarDayButton>
        )
    }

    // Get color class based on attendance status
    const getAttendanceColor = (status: AttendanceStatus | null): string => {
        if (!status) return ''
        switch (status) {
            case 'P':
                return 'rounded-md bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/40'
            case 'H':
                return 'rounded-md bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/40'
            case 'A':
                return 'rounded-md bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/40'
            default:
                return ''
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={() => {
                onOpenChange()
                setOpen(null)
            }}
        >
            <DialogContent className='max-w-3xl'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <CalendarDays className='h-5 w-5' />
                        Attendance Calendar
                    </DialogTitle>
                    <DialogDescription>
                        {currentRow.firstName} {currentRow.lastName} •{' '}
                        {currentRow.role.charAt(0).toUpperCase() +
                            currentRow.role.slice(1)}
                    </DialogDescription>
                </DialogHeader>

                <div className='flex justify-center'>
                    <Calendar
                        mode='single'
                        month={month}
                        onMonthChange={setMonth}
                        className='rounded-lg border-2 shadow-sm [--cell-size:52px]'
                        modifiers={{
                            present: (date) =>
                                getAttendanceForDate(date) === 'P',
                            holiday: (date) =>
                                getAttendanceForDate(date) === 'H',
                            absent: (date) =>
                                getAttendanceForDate(date) === 'A',
                        }}
                        modifiersClassNames={{
                            present: getAttendanceColor('P'),
                            holiday: getAttendanceColor('H'),
                            absent: getAttendanceColor('A'),
                        }}
                        components={{
                            DayButton: AttendanceDayButton,
                        }}
                    />
                </div>

                <DialogFooter>
                    <Button
                        variant='outline'
                        onClick={() => {
                            onOpenChange()
                            setOpen(null)
                        }}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
