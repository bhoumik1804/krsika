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

type PurchaseDealRow = {
    description: string
    quantity: number
}

export function PurchaseDealsReport() {
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })

    // Sample data matching the image categories
    const purchaseDeals: PurchaseDealRow[] = [
        { description: 'Paddy (Mota)', quantity: 0 },
        { description: 'Paddy (Patla)', quantity: 0 },
        { description: 'Paddy (Sarna)', quantity: 0 },
        { description: 'Paddy (Mahamaya)', quantity: 0 },
        { description: 'Paddy (RB GOLD)', quantity: 0 },
        { description: 'Rice (Patla)', quantity: 0 },
        { description: 'Rice (Mota)', quantity: 0 },
        { description: 'FRK', quantity: 0 },
        { description: 'New Gunny', quantity: 0 },
        { description: 'Old Gunny', quantity: 0 },
        { description: 'Plastic Gunny', quantity: 0 },
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
                            Purchase Deals
                        </h2>
                        <p className='text-muted-foreground'>
                            Track daily purchase transactions by commodity
                        </p>
                    </div>
                    <DateRangePicker
                        date={dateRange}
                        onDateChange={setDateRange}
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Purchase Summary</CardTitle>
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
                                            Quantity
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {purchaseDeals.map((deal, index) => (
                                        <TableRow key={index}>
                                            <TableCell className='font-medium'>
                                                {deal.description}
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                {deal.quantity.toFixed(2)}
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
