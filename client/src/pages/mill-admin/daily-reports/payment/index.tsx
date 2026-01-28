import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { useParams } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DateRangePicker } from './components/date-range-picker'

type PaymentRow = {
    description: string
    amount: number
}

export function PaymentReport() {
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })

    // Sample data matching the image categories
    const payments: PaymentRow[] = [
        { description: 'Party Name / Broker Name', amount: 0 },
        { description: 'Transporter', amount: 0 },
        { description: 'Diesel', amount: 0 },
        { description: 'Allowance', amount: 0 },
        { description: 'Repair / Maintenance', amount: 0 },
        { description: 'Hamali', amount: 0 },
        { description: 'Salary', amount: 0 },
        { description: 'Other Expenses', amount: 0 },
    ]

    return (
        <>
            <Header fixed>
                <Search />
                <div className='ms-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown
                        user={sidebarData.user}
                        links={sidebarData.profileLinks}
                    />
                </div>
            </Header>

            <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>
                            Daily Payments
                        </h2>
                        <p className='text-muted-foreground'>
                            Track all daily payment transactions
                        </p>
                    </div>
                    <DateRangePicker
                        date={dateRange}
                        onDateChange={setDateRange}
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='overflow-x-auto'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='w-[300px]'>
                                            Description
                                        </TableHead>
                                        <TableHead className='text-right'>
                                            Amount
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell className='font-medium'>
                                                {row.description}
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                {row.amount.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </Main>
        </>
    )
}
