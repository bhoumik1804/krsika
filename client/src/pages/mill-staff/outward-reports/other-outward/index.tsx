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
import { OtherOutwardDialogs } from './components/other-outward-dialogs'
import { OtherOutwardPrimaryButtons } from './components/other-outward-primary-buttons'
import { OtherOutwardProvider } from './components/other-outward-provider'
import { OtherOutwardTable } from './components/other-outward-table'
import { useOtherOutwardList } from './data/hooks'
import { type OtherOutwardQueryParams } from './data/types'

export function OtherOutwardReport() {
    const { t } = useTranslation('millStaff')
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()
    const sidebarData = getMillAdminSidebarData(millId || '')

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

    // Build query params from URL search params
    const queryParams: OtherOutwardQueryParams = {
        page: search.page ? parseInt(search.page, 10) : 1,
        limit: search.limit ? parseInt(search.limit, 10) : 10,
        search: search.search,
        partyName: search.partyName,
        brokerName: search.brokerName,
        itemName: search.itemName,
        startDate: search.startDate,
        endDate: search.endDate,
        sortBy: search.sortBy as OtherOutwardQueryParams['sortBy'],
        sortOrder: search.sortOrder as 'asc' | 'desc',
    }

    const {
        data: apiData,
        isLoading,
        error,
    } = useOtherOutwardList(millId || '', queryParams)

    if (isLoading) {
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
                <Main className='flex flex-1 items-center justify-center'>
                    <LoadingSpinner />
                </Main>
            </>
        )
    }

    if (error) {
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
                <Main className='flex flex-1 items-center justify-center'>
                    <p className='text-destructive'>
                        Error loading data: {error.message}
                    </p>
                </Main>
            </>
        )
    }

    const entries = apiData?.entries || []
    const pagination = apiData?.pagination

    return (
        <OtherOutwardProvider millId={millId || ''} apiData={apiData}>
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

            <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>
                            {t('reports.outwardReports.other.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('reports.outwardReports.other.subtitle')}
                        </p>
                    </div>
                    <OtherOutwardPrimaryButtons />
                </div>
                <OtherOutwardTable
                    data={entries}
                    search={search}
                    navigate={navigate}
                    pagination={pagination}
                />
            </Main>

            <OtherOutwardDialogs />
        </OtherOutwardProvider>
    )
}
