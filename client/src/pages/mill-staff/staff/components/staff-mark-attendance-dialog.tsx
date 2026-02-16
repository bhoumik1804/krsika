import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { type AttendanceStatus } from '../data/schema'
import { useStaff } from './staff-provider'

export function StaffMarkAttendanceDialog() {
    const { t } = useTranslation('millStaff')
    const { open, setOpen, currentRow } = useStaff()
    const isOpen = open === 'mark-attendance'
    const [selectedAttendance, setSelectedAttendance] =
        useState<AttendanceStatus | null>(null)

    useEffect(() => {
        if (isOpen && currentRow?.attendanceHistory) {
            const today = new Date().toISOString().split('T')[0]
            const todayRecord = currentRow.attendanceHistory.find(
                (record) => record.date === today
            )
            setSelectedAttendance(todayRecord?.status ?? null)
        } else if (!isOpen) {
            setSelectedAttendance(null)
        }
    }, [isOpen, currentRow])

    const handleMarkAttendance = (status: AttendanceStatus) => {
        setSelectedAttendance(status)
    }

    const handleSubmit = () => {
        if (!currentRow || !selectedAttendance) return

        const data = {
            staffId: currentRow._id,
            staffName: currentRow.fullName,
            attendance: selectedAttendance,
            date: new Date().toLocaleDateString(),
        }

        showSubmittedData(data)
        setOpen(null)
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => setOpen(null)}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>{t('staff.markAttendance')}</DialogTitle>
                    <DialogDescription>
                        {t('staff.markAttendanceDescription', {
                            name: currentRow?.fullName,
                        }) || (
                            <>
                                Mark attendance for{' '}
                                <span className='font-semibold text-foreground'>
                                    {currentRow?.fullName}
                                </span>
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className='flex flex-col gap-4 py-4'>
                    <p className='text-sm text-muted-foreground'>
                        {t('staff.selectAttendanceStatus')}
                    </p>
                    <div className='flex items-center justify-center gap-4'>
                        <Button
                            type='button'
                            size='lg'
                            onClick={() => handleMarkAttendance('P')}
                            className={`h-20 w-20 text-2xl font-bold transition-all ${
                                selectedAttendance === 'P'
                                    ? 'bg-green-600 text-white ring-4 ring-green-600/50 hover:bg-green-700'
                                    : 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400 dark:hover:bg-green-950/50'
                            }`}
                        >
                            P
                        </Button>
                        <Button
                            type='button'
                            size='lg'
                            onClick={() => handleMarkAttendance('H')}
                            className={`h-20 w-20 text-2xl font-bold transition-all ${
                                selectedAttendance === 'H'
                                    ? 'bg-orange-600 text-white ring-4 ring-orange-600/50 hover:bg-orange-700'
                                    : 'bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-950/30 dark:text-orange-400 dark:hover:bg-orange-950/50'
                            }`}
                        >
                            H
                        </Button>
                        <Button
                            type='button'
                            size='lg'
                            onClick={() => handleMarkAttendance('A')}
                            className={`h-20 w-20 text-2xl font-bold transition-all ${
                                selectedAttendance === 'A'
                                    ? 'bg-red-600 text-white ring-4 ring-red-600/50 hover:bg-red-700'
                                    : 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50'
                            }`}
                        >
                            A
                        </Button>
                    </div>
                    <div className='grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground'>
                        <span>{t('staff.present')}</span>
                        <span>{t('staff.halfDay')}</span>
                        <span>{t('staff.absent')}</span>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={() => setOpen(null)}
                    >
                        {t('staff.cancel')}
                    </Button>
                    <Button
                        type='button'
                        onClick={handleSubmit}
                        disabled={!selectedAttendance}
                    >
                        {t('staff.saveAttendance')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
