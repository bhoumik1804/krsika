import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { superAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { MillsDialogs } from './components/mills-dialogs'
import { MillsPrimaryButtons } from './components/mills-primary-buttons'
import { MillsProvider } from './components/mills-provider'
import { MillsTable } from './components/mills-table'
import { useMillsList } from './data/hooks'
import type { MillStatus } from './data/schema'

export function Mills() {
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
            status: search.status as MillStatus | undefined,
            sortBy: (search.sortBy as string) || 'createdAt',
            sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
        }
    }, [search])

    // Fetch mills data using the hook
    const {
        data: millsResponse,
        isLoading,
        isError,
    } = useMillsList(queryParams)

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
    const millsData = useMemo(() => {
        if (!millsResponse?.mills) return []
        return millsResponse.mills.map((m) => ({
            id: m._id,
            name: m.millName,
            email: m.contact.email,
            phone: m.contact.phone,
            location: m.contact.address || '',
            gstNumber: m.millInfo.gstNumber,
            panNumber: m.millInfo.panNumber,
            mnmNumber: m.millInfo.mnmNumber,
            status: m.status,
            createdAt: new Date(m.createdAt),
            updatedAt: new Date(m.updatedAt),
        }))
    }, [millsResponse])

    return (
        <MillsProvider>
            <Header fixed>
                <Search />
                <div className='ms-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown
                        user={superAdminSidebarData.user}
                        links={superAdminSidebarData.profileLinks}
                    />
                </div>
            </Header>

            <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>
                            Mills List
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage your mills and their operations here.
                        </p>
                    </div>
                    <MillsPrimaryButtons />
                </div>
                {isError ? (
                    <div className='py-10 text-center text-destructive'>
                        Failed to load mills data
                    </div>
                ) : (
                    <MillsTable
                        data={millsData}
                        search={search}
                        navigate={navigate}
                        pagination={millsResponse?.pagination}
                        isLoading={isLoading}
                    />
                )}
            </Main>

            <MillsDialogs />
        </MillsProvider>
    )
}
