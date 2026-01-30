import { UserCog } from 'lucide-react'
import { useParams, useSearchParams } from 'react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { StaffDialogs } from './components/staff-dialogs'
// import { StaffPrimaryButtons } from './components/staff-primary-buttons'
import { StaffProvider } from './components/staff-provider'
import { StaffTable } from './components/staff-table'
import { staff } from './data/staff'

export function MillAdminStaff() {
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')
    const [searchParams, setSearchParams] = useSearchParams()

    const search = Object.fromEntries(searchParams.entries())

    const navigate = (opts: { search: unknown; replace?: boolean }) => {
        if (typeof opts.search === 'function') {
            const newSearch = opts.search(search)
            setSearchParams(newSearch as Record<string, string>)
        } else if (opts.search === true) {
            // Keep current params
        } else {
            setSearchParams(opts.search as Record<string, string>)
        }
    }

    const activeStaff = staff.filter((s) => s.status === 'active')
    const suspendedStaff = staff.filter((s) => s.status === 'suspended')

    return (
        <StaffProvider>
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
                        <div className='flex items-center gap-2'>
                            <UserCog className='h-5 w-5' />
                            <h2 className='text-2xl font-bold tracking-tight'>
                                Staff Directory
                            </h2>
                        </div>
                        <p className='text-muted-foreground'>
                            Manage staff accounts, roles, and attendance.
                        </p>
                    </div>
                    {/* <StaffPrimaryButtons /> */}
                </div>

                <Tabs defaultValue='all' className='flex-1'>
                    <TabsList className='grid w-full grid-cols-3 md:w-[420px]'>
                        <TabsTrigger value='all'>All Staff</TabsTrigger>
                        <TabsTrigger value='active'>Active</TabsTrigger>
                        <TabsTrigger value='suspended'>Suspended</TabsTrigger>
                    </TabsList>
                    <TabsContent value='all' className='space-y-4'>
                        <StaffTable
                            data={staff}
                            search={search}
                            navigate={navigate}
                        />
                    </TabsContent>
                    <TabsContent value='active' className='space-y-4'>
                        <StaffTable
                            data={activeStaff}
                            search={search}
                            navigate={navigate}
                        />
                    </TabsContent>
                    <TabsContent value='suspended' className='space-y-4'>
                        <StaffTable
                            data={suspendedStaff}
                            search={search}
                            navigate={navigate}
                        />
                    </TabsContent>
                </Tabs>
            </Main>

            <StaffDialogs />
        </StaffProvider>
    )
}
