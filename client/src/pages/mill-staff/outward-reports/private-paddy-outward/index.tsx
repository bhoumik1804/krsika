import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PrivatePaddyOutwardDialogs } from './components/private-paddy-outward-dialogs'
import { PrivatePaddyOutwardPrimaryButtons } from './components/private-paddy-outward-primary-buttons'
import { PrivatePaddyOutwardProvider } from './components/private-paddy-outward-provider'
import { PrivatePaddyOutwardTable } from './components/private-paddy-outward-table'
import { usePrivatePaddyOutwardList } from './data/hooks'
import type { PrivatePaddyOutwardQueryParams } from './data/types'

function PrivatePaddyOutwardContent() {
    const { t } = useTranslation('mill-staff')
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
                (search.sortBy as PrivatePaddyOutwardQueryParams['sortBy']) ||
                'date',
            sortOrder:
                (search.sortOrder as PrivatePaddyOutwardQueryParams['sortOrder']) ||
                'desc',
        }),
        [search]
    )

    const {
        data: listData,
        isLoading,
        error,
    } = usePrivatePaddyOutwardList(millId || '', queryParams)

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
                            Private Paddy Outward Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage private paddy outward transactions and
                            records
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
                            Private Paddy Outward Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage private paddy outward transactions and
                            records
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
                        {t('outward.privatePaddyOutward.title')}
                    </h2>
                    <p className='text-muted-foreground'>
                        {t('outward.privatePaddyOutward.description')}
                    </p>
                </div>
                <PrivatePaddyOutwardPrimaryButtons />
            </div>
            <PrivatePaddyOutwardTable
                data={data}
                search={search}
                navigate={navigate}
                pagination={serverPagination}
            />
        </Main>
    )
}

export function PrivatePaddyOutwardReport() {
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')

    return (
        <PrivatePaddyOutwardProvider millId={millId || ''}>
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

            <PrivatePaddyOutwardContent />

            <PrivatePaddyOutwardDialogs />
        </PrivatePaddyOutwardProvider>
    )
}
