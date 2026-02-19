import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { GovtPaddyInwardDialogs } from './components/govt-paddy-inward-dialogs'
import { GovtPaddyInwardPrimaryButtons } from './components/govt-paddy-inward-primary-buttons'
import { GovtPaddyInwardProvider } from './components/govt-paddy-inward-provider'
import { GovtPaddyInwardTable } from './components/govt-paddy-inward-table'
import { useGovtPaddyInwardList } from './data/hooks'

export function GovtPaddyInwardReport() {
    const { t } = useTranslation('mill-staff')
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()
    const sidebarData = getMillAdminSidebarData(millId || '')

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
            startDate: search.startDate as string | undefined,
            endDate: search.endDate as string | undefined,
            sortBy:
                (search.sortBy as
                    | 'date'
                    | 'doNumber'
                    | 'committeeName'
                    | 'createdAt') || 'date',
            sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
        }
    }, [searchParams])

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

    return (
        <GovtPaddyInwardProvider millId={millId || ''}>
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
                            {t('inward.govtPaddyInward.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('inward.govtPaddyInward.description')}
                        </p>
                    </div>
                    <GovtPaddyInwardPrimaryButtons />
                </div>
                <GovtPaddyInwardContent
                    millId={millId || ''}
                    queryParams={queryParams}
                    search={search}
                    navigate={navigate}
                />
            </Main>

            <GovtPaddyInwardDialogs />
        </GovtPaddyInwardProvider>
    )
}

function GovtPaddyInwardContent({
    millId,
    queryParams,
    search,
    navigate,
}: {
    millId: string
    queryParams: {
        page: number
        limit: number
        search?: string
        startDate?: string
        endDate?: string
        sortBy?: 'date' | 'doNumber' | 'committeeName' | 'createdAt'
        sortOrder?: 'asc' | 'desc'
    }
    search: Record<string, string>
    navigate: (opts: { search: unknown; replace?: boolean }) => void
}) {
    const { t } = useTranslation('mill-staff')
    const {
        data: listData,
        isLoading,
        error,
    } = useGovtPaddyInwardList(millId, queryParams)

    const data = listData?.data ?? []
    const pagination = listData?.pagination

    if (isLoading) {
        return (
            <div className='flex items-center justify-center py-10'>
                <LoadingSpinner />
            </div>
        )
    }

    if (error) {
        return (
            <div className='py-10 text-center text-red-500'>
                {error.message ||
                    'Failed to load govt paddy inward data. Please try again later.'}
            </div>
        )
    }

    return (
        <GovtPaddyInwardTable
            data={data}
            search={search}
            navigate={navigate}
            pagination={pagination}
        />
    )
}
