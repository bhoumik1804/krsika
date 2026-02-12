import { useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { GovtRiceOutwardDialogs } from './components/govt-rice-outward-dialogs'
import { GovtRiceOutwardPrimaryButtons } from './components/govt-rice-outward-primary-buttons'
import { GovtRiceOutwardProvider } from './components/govt-rice-outward-provider'
import { GovtRiceOutwardTable } from './components/govt-rice-outward-table'
import { useGovtRiceOutwardList } from './data/hooks'
import type { GovtRiceOutwardQueryParams } from './data/types'

function GovtRiceOutwardContent() {
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()

    const search = Object.fromEntries(searchParams.entries())

    const queryParams = useMemo(
        () => ({
            page: search.page ? parseInt(search.page as string, 10) : 1,
            limit: search.limit ? parseInt(search.limit as string, 10) : 10,
            search: search.search ? (search.search as string) : undefined,
            startDate: search.startDate
                ? (search.startDate as string)
                : undefined,
            endDate: search.endDate ? (search.endDate as string) : undefined,
            sortBy:
                (search.sortBy as GovtRiceOutwardQueryParams['sortBy']) ||
                'date',
            sortOrder:
                (search.sortOrder as GovtRiceOutwardQueryParams['sortOrder']) ||
                'desc',
        }),
        [search]
    )

    const {
        data: listData,
        isLoading,
        error,
    } = useGovtRiceOutwardList(millId || '', queryParams)

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

    const data = listData?.entries ?? []
    const serverPagination = listData?.pagination

    if (isLoading) {
        return (
            <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>
                            Govt Rice Outward Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage govt rice outward transactions and records
                        </p>
                    </div>
                </div>
                <div className='flex items-center justify-center rounded-md border border-dashed p-8'>
                    <p className='text-muted-foreground'>Loading...</p>
                </div>
            </Main>
        )
    }

    if (error) {
        return (
            <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>
                            Govt Rice Outward Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage govt rice outward transactions and records
                        </p>
                    </div>
                </div>
                <div className='flex items-center justify-center rounded-md border border-dashed border-destructive p-8'>
                    <p className='text-destructive'>
                        Error loading data: {error.message}
                    </p>
                </div>
            </Main>
        )
    }

    return (
        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
            <div className='flex flex-wrap items-end justify-between gap-2'>
                <div>
                    <h2 className='text-2xl font-bold tracking-tight'>
                        Govt Rice Outward Report
                    </h2>
                    <p className='text-muted-foreground'>
                        Manage govt rice outward transactions and records
                    </p>
                </div>
                <GovtRiceOutwardPrimaryButtons />
            </div>
            <GovtRiceOutwardTable
                data={data}
                search={search}
                navigate={navigate}
                pagination={serverPagination}
            />
        </Main>
    )
}

export function GovtRiceOutwardReport() {
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')

    return (
        <GovtRiceOutwardProvider millId={millId || ''}>
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

            <GovtRiceOutwardContent />

            <GovtRiceOutwardDialogs />
        </GovtRiceOutwardProvider>
    )
}
