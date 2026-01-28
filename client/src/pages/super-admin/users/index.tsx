import { useSearchParams } from 'react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { superAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { users } from './data/users'

export function Users() {
    const [searchParams, setSearchParams] = useSearchParams()

    // Convert URLSearchParams to record
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

    const activeUsers = users.filter(
        (u) => u.status === 'active' && u.isPaymentDone && u.isMillVerified
    )
    const guestUsers = users.filter(
        (u) => !(u.status === 'active' && u.isPaymentDone && u.isMillVerified)
    )

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
                        <UsersTable
                            data={users}
                            search={search}
                            navigate={navigate}
                        />
                    </TabsContent>
                    <TabsContent value='active' className='space-y-4'>
                        <UsersTable
                            data={activeUsers}
                            search={search}
                            navigate={navigate}
                        />
                    </TabsContent>
                    <TabsContent value='guest' className='space-y-4'>
                        <UsersTable
                            data={guestUsers}
                            search={search}
                            navigate={navigate}
                        />
                    </TabsContent>
                </Tabs>
            </Main>

            <UsersDialogs />
        </UsersProvider>
    )
}
