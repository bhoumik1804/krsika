import { useMemo } from 'react'
import { UserCog } from 'lucide-react'
import { useParams, useSearchParams } from 'react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillStaffSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { StaffDialogs } from './components/staff-dialogs'
import { StaffProvider } from './components/staff-provider'
import { StaffTable } from './components/staff-table'
import { useStaffList } from './data/hooks'
import type { StaffRole } from './data/types'

export function MillStaffStaff() {
    const { millId } = useParams<{ millId: string; staffId: string }>()
    const sidebarData = getMillStaffSidebarData(millId || '')
    const [searchParams, setSearchParams] = useSearchParams()

    const search = Object.fromEntries(searchParams.entries())

    // Extract query params from URL
    const queryParams = useMemo(
        () => ({
            page: search.page ? parseInt(search.page as string, 10) : 1,
            limit: search.limit ? parseInt(search.limit as string, 10) : 10,
            search: search.search as string | undefined,
            status: search.status as
                | 'active'
                | 'inactive'
                | 'suspended'
                | undefined,
            role: search.role as StaffRole | undefined,
            sortBy: (search.sortBy as string) || 'createdAt',
            sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
        }),
        [search]
    )

    // Fetch staff data using the hook
    const {
        data: staffResponse,
        isLoading,
        isError,
    } = useStaffList(millId || '', queryParams, { enabled: !!millId })

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

    // Transform API response to table format
    const staffData = useMemo(() => {
        if (!staffResponse?.data) return []
        return staffResponse.data.map((s) => ({
            id: s._id,
            firstName: s.firstName,
            lastName: s.lastName,
            email: s.email,
            phoneNumber: s.phoneNumber,
            status: s.status,
            role: s.role,
            attendanceHistory: s.attendanceHistory,
            isPaymentDone: s.isPaymentDone,
            isMillVerified: s.isMillVerified,
            createdAt: new Date(s.createdAt),
            updatedAt: new Date(s.updatedAt),
        }))
    }, [staffResponse])

    const activeStaff = staffData.filter((s) => s.status === 'active')
    const suspendedStaff = staffData.filter((s) => s.status === 'suspended')

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
                </div>

                <Tabs defaultValue='all' className='flex-1'>
                    <TabsList className='grid w-full grid-cols-3 md:w-[420px]'>
                        <TabsTrigger value='all'>All Staff</TabsTrigger>
                        <TabsTrigger value='active'>Active</TabsTrigger>
                        <TabsTrigger value='suspended'>Suspended</TabsTrigger>
                    </TabsList>
                    <TabsContent value='all' className='space-y-4'>
                        {isLoading ? (
                            <div className='flex items-center justify-center py-10'>
                                <LoadingSpinner />
                            </div>
                        ) : isError ? (
                            <div className='py-10 text-center text-destructive'>
                                Failed to load staff data
                            </div>
                        ) : (
                            <StaffTable
                                data={staffData}
                                search={search}
                                navigate={navigate}
                            />
                        )}
                    </TabsContent>
                    <TabsContent value='active' className='space-y-4'>
                        {isLoading ? (
                            <div className='flex items-center justify-center py-10'>
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <StaffTable
                                data={activeStaff}
                                search={search}
                                navigate={navigate}
                            />
                        )}
                    </TabsContent>
                    <TabsContent value='suspended' className='space-y-4'>
                        {isLoading ? (
                            <div className='flex items-center justify-center py-10'>
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <StaffTable
                                data={suspendedStaff}
                                search={search}
                                navigate={navigate}
                            />
                        )}
                    </TabsContent>
                </Tabs>
            </Main>

            <StaffDialogs />
        </StaffProvider>
    )
}
