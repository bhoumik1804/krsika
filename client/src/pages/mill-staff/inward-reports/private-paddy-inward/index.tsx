import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitch } from '@/components/language-switch'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PrivatePaddyInwardDialogs } from './components/private-paddy-inward-dialogs'
import { PrivatePaddyInwardPrimaryButtons } from './components/private-paddy-inward-primary-buttons'
import { PrivatePaddyInwardProvider } from './components/private-paddy-inward-provider'
import { PrivatePaddyInwardTable } from './components/private-paddy-inward-table'
import { usePrivatePaddyInwardList } from './data/hooks'
import type { PrivatePaddyInwardQueryParams } from './data/types'

function PrivatePaddyInwardContent({ millId }: { millId: string }) {
    const { t } = useTranslation('millStaff')
    const [searchParams, setSearchParams] = useSearchParams()

    const search = Object.fromEntries(searchParams.entries())

    const queryParams: PrivatePaddyInwardQueryParams = useMemo(() => {
        const allowedPageSizes = [10, 20, 30, 40, 50]
        const rawLimit = search.limit
            ? parseInt(search.limit as string, 10)
            : 10
        const limit = allowedPageSizes.includes(rawLimit) ? rawLimit : 10

        return {
            page: search.page ? parseInt(search.page as string, 10) : 1,
            limit,
            search: search.search as string | undefined,
            startDate: search.startDate as string | undefined,
            endDate: search.endDate as string | undefined,
            sortBy: search.sortBy as string | undefined,
            sortOrder: search.sortOrder as 'asc' | 'desc' | undefined,
        }
    }, [search])

    const {
        data: listData,
        isLoading,
        error,
    } = usePrivatePaddyInwardList(millId, queryParams)

    const data = listData?.entries ?? []
    const pagination = listData?.pagination

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

    if (error) {
        return (
            <Main className='flex flex-1 flex-col items-center justify-center'>
                <div className='text-center'>
                    <h2 className='text-2xl font-bold text-destructive'>
                        Error loading data
                    </h2>
                    <p className='mt-2 text-muted-foreground'>
                        {error.message ||
                            'Failed to load private paddy inward records'}
                    </p>
                </div>
            </Main>
        )
    }

    return (
        <>
            <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>
                            {t('reports.inwardReports.privatePaddy.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('reports.inwardReports.privatePaddy.subtitle')}
                        </p>
                    </div>
                    <PrivatePaddyInwardPrimaryButtons />
                </div>
                {isLoading ? (
                    <div className='flex items-center justify-center py-8'>
                        <LoadingSpinner />
                    </div>
                ) : (
                    <PrivatePaddyInwardTable
                        data={data}
                        search={search}
                        navigate={navigate}
                        pagination={pagination}
                    />
                )}
            </Main>

            <PrivatePaddyInwardDialogs />
        </>
    )
}

export function PrivatePaddyInwardReport() {
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')

    if (!millId) {
        return (
            <Main className='flex flex-1 flex-col items-center justify-center'>
                <div className='text-center'>
                    <h2 className='text-2xl font-bold text-destructive'>
                        Mill ID is required
                    </h2>
                </div>
            </Main>
        )
    }

    return (
        <>
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

            <PrivatePaddyInwardProvider millId={millId}>
                <PrivatePaddyInwardContent millId={millId} />
            </PrivatePaddyInwardProvider>
        </>
    )
}
