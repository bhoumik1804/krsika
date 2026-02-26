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
import { OtherInwardDialogs } from './components/other-inward-dialogs'
import { OtherInwardPrimaryButtons } from './components/other-inward-primary-buttons'
import { OtherInwardProvider } from './components/other-inward-provider'
import { OtherInwardTable } from './components/other-inward-table'
import { useOtherInwardList } from './data/hooks'

export function OtherInwardReport() {
    const { t } = useTranslation('mill-staff')
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()

    // Extract query params from URL
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
            sortBy: (search.sortBy as string) || 'createdAt',
            sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
        }
    }, [searchParams])

    // Call GET API here
    const {
        data: apiData,
        pagination: apiPagination,
        isLoading,
        isError,
    } = useOtherInwardList({
        millId: millId || '',
        page: queryParams.page,
        pageSize: queryParams.limit,
        search: queryParams.search,
    })

    const sidebarData = getMillAdminSidebarData(millId || '')

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

    if (isError) {
        return (
            <Main className='flex flex-1 items-center justify-center'>
                <div className='text-center'>
                    <h2 className='text-lg font-semibold'>
                        Error loading data
                    </h2>
                    <p className='text-muted-foreground'>
                        Please try again later.
                    </p>
                </div>
            </Main>
        )
    }

    return (
        <OtherInwardProvider
            millId={millId || ''}
            initialQueryParams={queryParams}
            apiData={apiData}
            apiPagination={apiPagination}
            isLoading={isLoading}
            isError={isError}
        >
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
                            {t('inward.otherInward.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('inward.otherInward.description')}
                        </p>
                    </div>
                    <OtherInwardPrimaryButtons />
                </div>
                {isLoading ? (
                    <div className='flex flex-1 items-center justify-center'>
                        <LoadingSpinner />
                    </div>
                ) : (
                    <OtherInwardTable search={search} navigate={navigate} />
                )}
            </Main>

            <OtherInwardDialogs />
        </OtherInwardProvider>
    )
}
