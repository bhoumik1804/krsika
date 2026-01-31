import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { superAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { useUsersList } from './data/hooks'
import type { UserRole } from './data/schema'

export function Users() {
    const [searchParams, setSearchParams] = useSearchParams()

    // Convert URLSearchParams to record
    const search = Object.fromEntries(searchParams.entries())

    // Extract query params from URL
    const queryParams = useMemo(
        () => ({
            page: search.page ? parseInt(search.page as string, 10) : 1,
            limit: search.limit ? parseInt(search.limit as string, 10) : 10,
            search: search.search as string | undefined,
            role: search.role as UserRole | undefined,
            isActive:
                search.isActive !== undefined
                    ? search.isActive === 'true'
                    : undefined,
            sortBy: (search.sortBy as string) || 'createdAt',
            sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
        }),
        [search]
    )

    // Fetch users data using the hook
    const {
        data: usersResponse,
        isLoading,
        isError,
    } = useUsersList(queryParams)

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

    // Transform API response to table format - aligned with User model
    const usersData = useMemo(() => {
        if (!usersResponse?.data) return []
        return usersResponse.data.map((u) => ({
            id: u._id,
            fullName: u.fullName || '',
            email: u.email,
            avatar: u.avatar,
            status: u.isActive ? ('active' as const) : ('inactive' as const),
            role: u.role,
            millId: u.millId,
            lastLogin: u.lastLogin ? new Date(u.lastLogin) : null,
            createdAt: new Date(u.createdAt),
            updatedAt: new Date(u.updatedAt),
        }))
    }, [usersResponse])

    const activeUsers = usersData.filter((u) => u.status === 'active')
    const guestUsers = usersData.filter((u) => u.role === 'guest-user')

    const sidebarData = superAdminSidebarData

    return (
        <UsersProvider>
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
                            User List
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage your users and their roles here.
                        </p>
                    </div>
                    <UsersPrimaryButtons />
                </div>

                <Tabs defaultValue='all' className='flex-1'>
                    <TabsList className='grid w-full grid-cols-3 md:w-[400px]'>
                        <TabsTrigger value='all'>All User</TabsTrigger>
                        <TabsTrigger value='active'>Active User</TabsTrigger>
                        <TabsTrigger value='guest'>Guest User</TabsTrigger>
                    </TabsList>
                    <TabsContent value='all' className='space-y-4'>
                        {isLoading ? (
                            <div className='flex items-center justify-center py-10'>
                                <LoadingSpinner />
                            </div>
                        ) : isError ? (
                            <div className='py-10 text-center text-destructive'>
                                Failed to load users data
                            </div>
                        ) : (
                            <UsersTable
                                data={usersData}
                                search={search}
                                navigate={navigate}
                                pagination={usersResponse?.pagination}
                            />
                        )}
                    </TabsContent>
                    <TabsContent value='active' className='space-y-4'>
                        {isLoading ? (
                            <div className='flex items-center justify-center py-10'>
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <UsersTable
                                data={activeUsers}
                                search={search}
                                navigate={navigate}
                            />
                        )}
                    </TabsContent>
                    <TabsContent value='guest' className='space-y-4'>
                        {isLoading ? (
                            <div className='flex items-center justify-center py-10'>
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <UsersTable
                                data={guestUsers}
                                search={search}
                                navigate={navigate}
                            />
                        )}
                    </TabsContent>
                </Tabs>
            </Main>

            <UsersDialogs />
        </UsersProvider>
    )
}
