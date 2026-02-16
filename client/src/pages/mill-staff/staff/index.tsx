import { useMemo } from 'react'
import { UserCog } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitch } from '@/components/language-switch'
import { getMillStaffSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { StaffDialogs } from './components/staff-dialogs'
import { StaffProvider } from './components/staff-provider'
import { StaffTable } from './components/staff-table'
import { useStaffList } from './data/hooks'
import type { StaffPost } from './data/types'

export function MillStaffStaff() {
    const { millId } = useParams<{ millId: string; staffId: string }>()
    const sidebarData = getMillStaffSidebarData(millId || '')
    const [searchParams, setSearchParams] = useSearchParams()

    const search = Object.fromEntries(searchParams.entries())

    // Extract query params from URL
    const queryParams = useMemo(() => {
        const allowedPageSizes = [10, 20, 30, 40, 50]
        const rawLimit = search.limit
            ? parseInt(search.limit as string, 10)
            : 10
        // Validate limit against allowed values
        const limit = allowedPageSizes.includes(rawLimit) ? rawLimit : 10

        return {
            page: search.page ? parseInt(search.page as string, 10) : 1,
            limit,
            search: search.search as string | undefined,
            isActive: search.isActive as string | undefined,
            post: search.post as StaffPost | undefined,
            sortBy: (search.sortBy as string) || 'createdAt',
            sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
        }
    }, [search])

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
        if (!staffResponse?.staffList) return []
        return staffResponse.staffList.map((s) => ({
            _id: s._id,
            fullName: s.fullName,
            email: s.email,
            phoneNumber: s.phoneNumber,
            role: s.role,
            millId: s.millId,
            isActive: s.isActive,
            post: s.post,
            salary: s.salary,
            address: s.address,
            permissions: s.permissions,
            attendanceHistory: s.attendanceHistory,
            createdAt: new Date(s.createdAt),
            updatedAt: new Date(s.updatedAt),
        }))
    }, [staffResponse])

    const activeStaff = staffData.filter((s) => s.isActive)
    const inactiveStaff = staffData.filter((s) => !s.isActive)
    const { t } = useTranslation('mill-staff')

    return (
        <StaffProvider>
            <Header fixed>
                <Search />
                <div className='ms-auto flex items-center space-x-4'>
                    <LanguageSwitch />
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
                                {t('staff.title')}
                            </h2>
                        </div>
                        <p className='text-muted-foreground'>
                            {t('staff.subtitle')}
                        </p>
                    </div>
                </div>

                <Tabs defaultValue='all' className='flex-1'>
                    <TabsList className='grid w-full grid-cols-3 md:w-[420px]'>
                        <TabsTrigger value='all'>
                            {t('staff.allStaff')}
                        </TabsTrigger>
                        <TabsTrigger value='active'>
                            {t('staff.activeStaff')}
                        </TabsTrigger>
                        <TabsTrigger value='inactive'>
                            {t('staff.inactiveStaff')}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value='all' className='space-y-4'>
                        {isError ? (
                            <div className='py-10 text-center text-destructive'>
                                {t('staff.failedToLoad')}
                            </div>
                        ) : (
                            <StaffTable
                                data={staffData}
                                search={search}
                                navigate={navigate}
                                isLoading={isLoading}
                            />
                        )}
                    </TabsContent>
                    <TabsContent value='active' className='space-y-4'>
                        <StaffTable
                            data={activeStaff}
                            search={search}
                            navigate={navigate}
                            isLoading={isLoading}
                        />
                    </TabsContent>
                    <TabsContent value='inactive' className='space-y-4'>
                        <StaffTable
                            data={inactiveStaff}
                            search={search}
                            navigate={navigate}
                            isLoading={isLoading}
                        />
                    </TabsContent>
                </Tabs>
            </Main>

            <StaffDialogs />
        </StaffProvider>
    )
}
