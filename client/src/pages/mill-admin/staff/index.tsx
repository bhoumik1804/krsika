import { UserCog, Plus, Download, Calendar } from 'lucide-react'
import { useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

export function MillAdminStaff() {
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')
    return (
        <>
            <Header>
                <div className='flex items-center gap-2'>
                    <UserCog className='h-5 w-5' />
                    <h1 className='text-lg font-semibold'>Staff Management</h1>
                </div>
                <div className='ms-auto flex items-center space-x-4'>
                    <Search />
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown
                        user={sidebarData.user}
                        links={sidebarData.profileLinks}
                    />
                </div>
            </Header>

            <Main>
                <div className='mb-6 flex items-center justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold tracking-tight'>
                            Staff
                        </h1>
                        <p className='text-muted-foreground'>
                            Manage staff accounts, roles, and attendance
                        </p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button variant='outline' size='sm'>
                            <Calendar className='mr-2 h-4 w-4' />
                            Attendance
                        </Button>
                        <Button variant='outline' size='sm'>
                            <Download className='mr-2 h-4 w-4' />
                            Export
                        </Button>
                        <Button size='sm'>
                            <Plus className='mr-2 h-4 w-4' />
                            Add Staff
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className='mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    {[
                        {
                            name: 'Total Staff',
                            value: '24',
                            sub: 'Active employees',
                        },
                        {
                            name: 'Present Today',
                            value: '21',
                            sub: '87.5% attendance',
                        },
                        { name: 'On Leave', value: '2', sub: 'This week' },
                        { name: 'New Joiners', value: '3', sub: 'This month' },
                    ].map((item) => (
                        <Card key={item.name}>
                            <CardHeader className='pb-2'>
                                <CardTitle className='text-sm font-medium text-muted-foreground'>
                                    {item.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>
                                    {item.value}
                                </div>
                                <p className='text-xs text-muted-foreground'>
                                    {item.sub}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Staff Directory</CardTitle>
                        <CardDescription>
                            All staff members with roles and contact info
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex h-[400px] items-center justify-center text-muted-foreground'>
                        <div className='text-center'>
                            <UserCog className='mx-auto mb-4 h-12 w-12 text-muted-foreground/50' />
                            <p>Staff directory will be displayed here</p>
                            <p className='text-sm'>
                                Connect to backend API to load staff data
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </Main>
        </>
    )
}
