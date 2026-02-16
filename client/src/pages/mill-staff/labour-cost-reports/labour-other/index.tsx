import { useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { LabourOtherDialogs } from './components/labour-other-dialogs'
import { LabourOtherPrimaryButtons } from './components/labour-other-primary-buttons'
import { LabourOtherProvider } from './components/labour-other-provider'
import { LabourOtherTable } from './components/labour-other-table'
import { useLabourOtherList } from './data/hooks'

export function LabourOtherReport() {
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()

    const queryParams = useMemo(() => {
        const search = Object.fromEntries(searchParams.entries())
        const allowedPageSizes = [10, 20, 30, 40, 50]
        const rawLimit = search.limit
            ? parseInt(search.limit as string, 10)
            : 10
        const limit = allowedPageSizes.includes(rawLimit) ? rawLimit : 10

        return {
            page: search.page ? parseInt(search.page as string, 10) : 1,
            limit,
            search: search.search as string | undefined,
            labourGroupName: search.labourGroupName as string | undefined,
            startDate: search.startDate as string | undefined,
            endDate: search.endDate as string | undefined,
            sortBy: (search.sortBy as string) || 'date',
            sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
        }
    }, [searchParams])

    const sidebarData = getMillAdminSidebarData(millId || '')

    const { data, isLoading, isError } = useLabourOtherList(
        millId || '',
        queryParams
    )

    const navigate = (opts: { search: unknown; replace?: boolean }) => {
        const search = Object.fromEntries(searchParams.entries())
        if (typeof opts.search === 'function') {
            const newSearch = opts.search(search)
            setSearchParams(newSearch as Record<string, string>)
        } else if (opts.search === true) {
            // Keep current params
        } else {
            setSearchParams(opts.search as Record<string, string>)
        }
    }

    if (isLoading) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <LoadingSpinner />
            </div>
        )
    }

    if (isError) {
        return (
            <div className='flex h-screen items-center justify-center text-red-500'>
                Failed to load data. Please try again later.
            </div>
        )
    }

    return (
        <LabourOtherProvider>
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
                            Labour Other Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage labour other transactions and records
                        </p>
                    </div>
                    <LabourOtherPrimaryButtons />
                </div>
                <LabourOtherTable
                    data={data?.entries || []}
                    search={Object.fromEntries(
                        Object.entries(queryParams || {})
                            .filter(([, value]) => value !== undefined)
                            .map(([key, value]) => [key, String(value)])
                    )}
                    navigate={navigate}
                    pagination={data?.pagination}
                />
            </Main>

            <LabourOtherDialogs />
        </LabourOtherProvider>
    )
}
