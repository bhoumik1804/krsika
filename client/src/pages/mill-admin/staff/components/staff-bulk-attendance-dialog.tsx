import { useMemo, useState } from 'react'
import { CalendarRange, Check, MoveRight, X } from 'lucide-react'
import { type DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, CalendarDayButton } from '@/components/ui/calendar'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { type AttendanceStatus, type Staff } from '../data/schema'
import { useStaff } from './staff-provider'

type StaffBulkAttendanceDialogProps = {
    open: boolean
    onOpenChange: () => void
    currentRow: Staff
}

export function StaffBulkAttendanceDialog({
    open,
    onOpenChange,
    currentRow,
}: StaffBulkAttendanceDialogProps) {
    const { setOpen } = useStaff()
    const [month, setMonth] = useState<Date>(new Date())
    const [range, setRange] = useState<DateRange | undefined>()
    const [attendanceData, setAttendanceData] = useState(
        currentRow.attendanceHistory || []
    )
    const [step, setStep] = useState<1 | 2>(1)
    const [selectedStatus, setSelectedStatus] =
        useState<AttendanceStatus | null>(null)

    const attendanceMap = useMemo(() => {
        const map = new Map<string, AttendanceStatus>()
        attendanceData.forEach((record) => {
            map.set(record.date, record.status)
        })
        return map
    }, [attendanceData])

    const getAttendanceForDate = (date: Date): AttendanceStatus | null => {
        const dateStr = date.toISOString().split('T')[0]
        return attendanceMap.get(dateStr) || null
    }

    const applyRangeStatus = () => {
        if (!range?.from || !range?.to || !selectedStatus) return

        const newData = [...attendanceData]
        const start = new Date(range.from)
        const end = new Date(range.to)

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0]
            const existingIndex = newData.findIndex(
                (record) => record.date === dateStr
            )

            if (existingIndex >= 0) {
                newData[existingIndex] = {
                    date: dateStr,
                    status: selectedStatus,
                }
            } else {
                newData.push({ date: dateStr, status: selectedStatus })
            }
        }

        setAttendanceData(newData)
        currentRow.attendanceHistory = newData

        // Reset and close
        setStep(1)
        setRange(undefined)
        setSelectedStatus(null)
        onOpenChange()
        setOpen(null)
    }

    const handleContinueFromStep1 = () => {
        if (range?.from && range?.to) {
            setStep(2)
        }
    }

    const handleContinueFromStep2 = () => {
        if (selectedStatus) {
            applyRangeStatus()
        }
    }

    const handleBack = () => {
        if (step === 2) {
            setSelectedStatus(null)
            setStep(1)
        }
    }

    const handleClose = () => {
        setStep(1)
        setRange(undefined)
        setSelectedStatus(null)
        onOpenChange()
        setOpen(null)
    }

    const getAttendanceColor = (status: AttendanceStatus | null): string => {
        if (!status) return ''
        switch (status) {
            case 'P':
                return 'rounded-lg bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/40'
            case 'H':
                return 'rounded-lg bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/40'
            case 'A':
                return 'rounded-lg bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/40'
            default:
                return ''
        }
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

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className='max-w-4xl'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <CalendarRange className='h-5 w-5' />
                        Bulk Attendance Update
                    </DialogTitle>
                </DialogHeader>

                <div className='space-y-6'>
                    {/* Step 1: Date Range Selection */}
                    {step === 1 && (
                        <>
                            <div className='flex justify-center'>
                                <Calendar
                                    mode='range'
                                    selected={range}
                                    onSelect={setRange}
                                    month={month}
                                    onMonthChange={setMonth}
                                    className='border-2 border-border shadow-sm [--cell-size:52px]'
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
                        </>
                    )}

                    {/* Step 2: Status Selection */}
                    {step === 2 && (
                        <>
                            <div className='rounded-lg border bg-gradient-to-br from-blue-50/50 to-blue-50/20 p-4 dark:from-blue-950/20 dark:to-blue-900/10'>
                                <div className='space-y-2'>
                                    <p className='text-sm font-semibold text-foreground'>
                                        Selected Date Range
                                    </p>
                                    <p className='font-medium text-blue-700 dark:text-blue-300'>
                                        {range?.from?.toLocaleDateString(
                                            'en-US',
                                            {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            }
                                        )}{' '}
                                        <MoveRight />{' '}
                                        {range?.to?.toLocaleDateString(
                                            'en-US',
                                            {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            }
                                        )}
                                    </p>
                                    <Badge
                                        variant='secondary'
                                        className='text-xs font-medium'
                                    >
                                        {range?.from &&
                                            range?.to &&
                                            Math.ceil(
                                                (range.to.getTime() -
                                                    range.from.getTime()) /
                                                    (1000 * 60 * 60 * 24)
                                            ) + 1}{' '}
                                        days
                                    </Badge>
                                </div>
                            </div>

                            <Separator />

                            <div className='space-y-3'>
                                <p className='text-sm font-semibold text-foreground'>
                                    Choose Attendance Status
                                </p>
                                <div className='grid grid-cols-3 gap-3'>
                                    <Button
                                        size='lg'
                                        variant={
                                            selectedStatus === 'P'
                                                ? 'default'
                                                : 'outline'
                                        }
                                        onClick={() => setSelectedStatus('P')}
                                        className={cn(
                                            'h-24 flex-col gap-2 border-2',
                                            selectedStatus === 'P'
                                                ? 'border-green-500/40 bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:text-green-300'
                                                : 'border-green-500/40 hover:bg-green-500/10'
                                        )}
                                    >
                                        <Check className='h-6 w-6' />
                                        <span className='text-sm font-semibold'>
                                            Present
                                        </span>
                                    </Button>
                                    <Button
                                        size='lg'
                                        variant={
                                            selectedStatus === 'H'
                                                ? 'default'
                                                : 'outline'
                                        }
                                        onClick={() => setSelectedStatus('H')}
                                        className={cn(
                                            'h-24 flex-col gap-2 border-2',
                                            selectedStatus === 'H'
                                                ? 'border-orange-500/40 bg-orange-500/20 text-orange-700 hover:bg-orange-500/30 dark:text-orange-300'
                                                : 'border-orange-500/40 hover:bg-orange-500/10'
                                        )}
                                    >
                                        <Check className='h-6 w-6' />
                                        <span className='text-sm font-semibold'>
                                            Half Day
                                        </span>
                                    </Button>
                                    <Button
                                        size='lg'
                                        variant={
                                            selectedStatus === 'A'
                                                ? 'default'
                                                : 'outline'
                                        }
                                        onClick={() => setSelectedStatus('A')}
                                        className={cn(
                                            'h-24 flex-col gap-2 border-2',
                                            selectedStatus === 'A'
                                                ? 'border-red-500/40 bg-red-500/20 text-red-700 hover:bg-red-500/30 dark:text-red-300'
                                                : 'border-red-500/40 hover:bg-red-500/10'
                                        )}
                                    >
                                        <X className='h-6 w-6' />
                                        <span className='text-sm font-semibold'>
                                            Absent
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter className='gap-2'>
                    {step > 1 && (
                        <Button variant='outline' onClick={handleBack}>
                            Back
                        </Button>
                    )}
                    <Button variant='outline' onClick={handleClose}>
                        Cancel
                    </Button>
                    {step === 1 && (
                        <Button
                            onClick={handleContinueFromStep1}
                            disabled={!range?.from || !range?.to}
                        >
                            Continue
                        </Button>
                    )}
                    {step === 2 && (
                        <Button
                            onClick={handleContinueFromStep2}
                            disabled={!selectedStatus}
                        >
                            Confirm & Apply
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
