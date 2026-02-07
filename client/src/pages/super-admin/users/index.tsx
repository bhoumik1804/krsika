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
            role: search.role as UserRole | undefined,
            isActive:
                search.isActive !== undefined
                    ? search.isActive === 'true'
                    : undefined,
            sortBy: (search.sortBy as string) || 'createdAt',
            sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
        }
    }, [search])

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

    // Determine active tab based on URL parameters
    const getCurrentTab = () => {
        if (search.role === 'guest-user') return 'guest'
        if (search.isActive === 'true') return 'active'
        return 'all'
    }

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

                <Tabs
                    value={getCurrentTab()}
                    className='flex-1'
                    onValueChange={(tab) => {
                        const newSearch: Record<string, string> = {
                            ...search,
                            page: '1',
                        } as Record<string, string>
                        if (tab === 'active') {
                            newSearch.isActive = 'true'
                        } else if (tab === 'guest') {
                            newSearch.role = 'guest-user'
                        } else {
                            delete newSearch.isActive
                            delete newSearch.role
                        }
                        setSearchParams(newSearch)
                    }}
                >
                    <TabsList className='grid w-full grid-cols-3 md:w-[400px]'>
                        <TabsTrigger value='all'>All User</TabsTrigger>
                        <TabsTrigger value='active'>Active User</TabsTrigger>
                        <TabsTrigger value='guest'>Guest User</TabsTrigger>
                    </TabsList>
                    <TabsContent value='all' className='space-y-4'>
                        {isLoading ? (
                            <LoadingSpinner className='h-full w-full' />
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
                            <LoadingSpinner className='h-full w-full' />
                        ) : (
                            <UsersTable
                                data={usersData}
                                search={search}
                                navigate={navigate}
                                pagination={usersResponse?.pagination}
                            />
                        )}
                    </TabsContent>
                    <TabsContent value='guest' className='space-y-4'>
                        {isLoading ? (
                            <LoadingSpinner className='h-full w-full' />
                        ) : (
                            <UsersTable
                                data={usersData}
                                search={search}
                                navigate={navigate}
                                pagination={usersResponse?.pagination}
                            />
                        )}
                    </TabsContent>
                </Tabs>
            </Main>

            <UsersDialogs />
        </UsersProvider>
    )
}
