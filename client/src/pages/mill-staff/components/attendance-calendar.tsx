import * as React from 'react'
import { isBefore, startOfToday, isSameDay } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export type AttendanceStatus = 'present' | 'absent' | 'half-day'

interface AttendanceCalendarProps {
    attendance: { date: Date; status: AttendanceStatus }[]
    className?: string
}

// Basic color configuration for easy customization
export const statusColors = {
    present: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        hover: 'hover:bg-green-200 dark:hover:bg-green-900/50',
        dot: 'bg-green-300',
    },
    absent: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-300',
        hover: 'hover:bg-red-200 dark:hover:bg-red-900/50',
        dot: 'bg-red-300',
    },
    halfDay: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-300',
        hover: 'hover:bg-yellow-200 dark:hover:bg-yellow-900/50',
        dot: 'bg-yellow-300',
    },
    muted: {
        bg: 'bg-muted/50',
        text: 'text-muted-foreground',
        hover: 'hover:bg-muted',
        dot: 'bg-muted',
    },
}

export function AttendanceCalendar({
    attendance,
    className,
}: AttendanceCalendarProps) {
    // Group dates by status
    const modifiers = React.useMemo(() => {
        return {
            present: attendance
                .filter((a) => a.status === 'present')
                .map((a) => a.date),
            absent: attendance
                .filter((a) => a.status === 'absent')
                .map((a) => a.date),
            halfDay: attendance
                .filter((a) => a.status === 'half-day')
                .map((a) => a.date),
            muted: (date: Date) => {
                const today = startOfToday()
                const hasStatus = attendance.some((a) =>
                    isSameDay(a.date, date)
                )
                return isBefore(date, today) && !hasStatus
            },
        }
    }, [attendance])

    const modifiersClassNames = {
        present: cn(
            statusColors.present.bg,
            statusColors.present.text,
            'font-medium rounded-md'
        ),
        absent: cn(
            statusColors.absent.bg,
            statusColors.absent.text,
            'font-medium rounded-md'
        ),
        halfDay: cn(
            statusColors.halfDay.bg,
            statusColors.halfDay.text,
            'font-medium rounded-md'
        ),
        muted: cn(
            statusColors.muted.bg,
            statusColors.muted.text,
            'font-medium rounded-md'
        ),
    }

    return (
        <Card className={cn('w-full', className)}>
            <CardContent>
                <div className='flex justify-center'>
                    <Calendar
                        mode='single'
                        modifiers={modifiers}
                        modifiersClassNames={modifiersClassNames}
                        className={cn(
                            'rounded-md border p-4',
                            '[--cell-size:2.2rem] md:[--cell-size:2.4rem]'
                        )}
                        classNames={{
                            // column gap via border-spacing
                            table: 'w-full border-separate border-spacing-x-3 border-spacing-y-2',
                            // base day styles; margin-right adds extra column gap
                            day: cn(
                                'flex items-center justify-center',
                                'h-[--cell-size] w-[--cell-size]',
                                'mr-2 last:mr-0',
                                'rounded-md font-medium',
                                // default hover for days without a modifier
                                'hover:bg-muted/60'
                            ),
                            // today ring
                            today: 'border border-primary',
                        }}
                    />
                </div>

                {/* Legend */}
                <div className='mt-4 flex flex-wrap justify-center gap-4 text-sm'>
                    <div className='flex items-center gap-2'>
                        <div
                            className={cn(
                                'h-3 w-3 rounded-full',
                                statusColors.present.dot
                            )}
                        />
                        <span className='text-muted-foreground'>Present</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div
                            className={cn(
                                'h-3 w-3 rounded-full',
                                statusColors.absent.dot
                            )}
                        />
                        <span className='text-muted-foreground'>Absent</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div
                            className={cn(
                                'h-3 w-3 rounded-full',
                                statusColors.halfDay.dot
                            )}
                        />
                        <span className='text-muted-foreground'>Half Day</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
