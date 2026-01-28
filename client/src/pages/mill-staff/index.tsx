import { useState } from 'react'
import {
    Truck,
    Receipt,
    Clock,
    CheckCircle,
    AlertCircle,
    Calendar as CalendarIcon,
} from 'lucide-react'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillStaffSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import {
    AttendanceCalendar,
    AttendanceStatus,
    statusColors,
} from './components/attendance-calendar'

// Recent Entries Component
function RecentEntries() {
    const entries = [
        {
            id: 1,
            type: 'gate',
            desc: 'Paddy from Ramesh - 250 kg',
            time: '10:30 AM',
            status: 'completed',
        },
        {
            id: 2,
            type: 'sale',
            desc: 'Rice to Patel Store - 100 kg',
            time: '11:15 AM',
            status: 'completed',
        },
        {
            id: 3,
            type: 'gate',
            desc: 'Paddy from Suresh - 180 kg',
            time: '11:45 AM',
            status: 'completed',
        },
        {
            id: 4,
            type: 'gate',
            desc: 'Paddy from Kumar - 320 kg',
            time: '12:30 PM',
            status: 'pending',
        },
        {
            id: 5,
            type: 'sale',
            desc: 'Rice to Krishna Traders - 200 kg',
            time: '02:00 PM',
            status: 'pending',
        },
    ]

    return (
        <div className='space-y-3'>
            {entries.map((entry) => (
                <div
                    key={entry.id}
                    className='flex items-center gap-4 rounded-lg bg-muted/50 p-3'
                >
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            entry.type === 'gate'
                                ? 'bg-chart-1/20'
                                : 'bg-chart-2/20'
                        }`}
                    >
                        {entry.type === 'gate' ? (
                            <Truck className='h-4 w-4 text-chart-1' />
                        ) : (
                            <Receipt className='h-4 w-4 text-chart-2' />
                        )}
                    </div>
                    <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm font-medium text-foreground'>
                            {entry.desc}
                        </p>
                        <p className='flex items-center gap-2 text-xs text-muted-foreground'>
                            <Clock className='h-3 w-3' />
                            {entry.time}
                        </p>
                    </div>
                    <div>
                        {entry.status === 'completed' ? (
                            <CheckCircle className='h-5 w-5 text-chart-2' />
                        ) : (
                            <AlertCircle className='h-5 w-5 text-chart-4' />
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export function MillStaffDashboard() {
    const { millId, staffId } = useParams<{ millId: string; staffId: string }>()
    const sidebarData = getMillStaffSidebarData(millId || '', staffId || '')

    const [todayAttendance, setTodayAttendance] =
        useState<AttendanceStatus | null>(null)
    const [isMarkOpen, setIsMarkOpen] = useState(false)

    const handleMarkAttendance = (status: AttendanceStatus) => {
        setTodayAttendance(status)
    }

    return (
        <>
            {/* ===== Top Heading ===== */}
            <Header>
                <div className='flex items-center gap-2'>
                    <h1 className='text-lg font-semibold'>Staff Dashboard</h1>
                </div>
                <div className='ms-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown
                        user={sidebarData.user}
                        links={sidebarData.profileLinks}
                    />
                </div>
            </Header>

            {/* ===== Main ===== */}
            <Main>
                <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
                    <div className='mb-6'>
                        <h1 className='text-2xl font-bold tracking-tight'>
                            Good Morning! 👋
                        </h1>
                        <p className='text-muted-foreground'>
                            Here's your overview for today.
                        </p>
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                        <Popover open={isMarkOpen} onOpenChange={setIsMarkOpen}>
                            <PopoverTrigger asChild>
                                <Button>Mark Attendance</Button>
                            </PopoverTrigger>
                            <PopoverContent align='end' className='w-auto p-4'>
                                {todayAttendance ? (
                                    <div className='text-sm font-medium'>
                                        Attendance marked as{' '}
                                        <span className='font-bold text-primary capitalize'>
                                            {todayAttendance === 'half-day'
                                                ? 'Half Day'
                                                : todayAttendance}
                                        </span>
                                    </div>
                                ) : (
                                    <div className='flex gap-2'>
                                        <button
                                            onClick={() =>
                                                handleMarkAttendance('present')
                                            }
                                            className={cn(
                                                'flex h-10 w-10 items-center justify-center rounded-md font-medium transition-colors',
                                                statusColors.present.bg,
                                                statusColors.present.text,
                                                statusColors.present.hover
                                            )}
                                        >
                                            P
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleMarkAttendance('half-day')
                                            }
                                            className={cn(
                                                'flex h-10 w-10 items-center justify-center rounded-md font-medium transition-colors',
                                                statusColors.halfDay.bg,
                                                statusColors.halfDay.text,
                                                statusColors.halfDay.hover
                                            )}
                                        >
                                            H
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleMarkAttendance('absent')
                                            }
                                            className={cn(
                                                'flex h-10 w-10 items-center justify-center rounded-md font-medium transition-colors',
                                                statusColors.absent.bg,
                                                statusColors.absent.text,
                                                statusColors.absent.hover
                                            )}
                                        >
                                            A
                                        </button>
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant='outline'>
                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                    Attendance History
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0' align='end'>
                                <AttendanceCalendar
                                    attendance={[
                                        {
                                            date: new Date(2025, 0, 1),
                                            status: 'present',
                                        },
                                        {
                                            date: new Date(2025, 0, 2),
                                            status: 'present',
                                        },
                                        {
                                            date: new Date(2025, 0, 3),
                                            status: 'absent',
                                        },
                                        {
                                            date: new Date(2025, 0, 4),
                                            status: 'present',
                                        },
                                        {
                                            date: new Date(2025, 0, 5),
                                            status: 'half-day',
                                        },
                                        {
                                            date: new Date(2025, 0, 6),
                                            status: 'present',
                                        },
                                        {
                                            date: new Date(2025, 0, 7),
                                            status: 'present',
                                        },
                                        // Add more mock data as needed
                                    ]}
                                    className='border-0 shadow-none'
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                {/* Recent Entries */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Entries</CardTitle>
                        <CardDescription>
                            Your latest entries for today
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentEntries />
                    </CardContent>
                </Card>
            </Main>
        </>
    )
}
