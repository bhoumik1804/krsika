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
import { BhusaOutwardDialogs } from './components/bhusa-outward-dialogs'
import { BhusaOutwardPrimaryButtons } from './components/bhusa-outward-primary-buttons'
import { BhusaOutwardProvider } from './components/bhusa-outward-provider'
import { BhusaOutwardTable } from './components/bhusa-outward-table'
import { useBhusaOutwardList } from './data/hooks'

export function BhusaOutwardReport() {
    const { t } = useTranslation('millStaff')
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()
    const sidebarData = getMillAdminSidebarData(millId || '')

    const search = Object.fromEntries(searchParams.entries())

    const queryParams = {
        page: search.page ? parseInt(search.page as string, 10) : 1,
        limit: search.limit ? parseInt(search.limit as string, 10) : 10,
        search: search.search as string | undefined,
        sortBy: search.sortBy as
            | 'date'
            | 'partyName'
            | 'brokerName'
            | 'truckNo'
            | 'createdAt'
            | undefined,
        sortOrder: search.sortOrder as 'asc' | 'desc' | undefined,
    }

    const {
        data: apiData,
        isLoading,
        error,
    } = useBhusaOutwardList(millId || '', queryParams)

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
                    <p className='text-destructive'>Error loading data</p>
                </Main>
            </>
        )
    }

    return (
        <BhusaOutwardProvider millId={millId || ''} apiData={apiData}>
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
                            {t('reports.outwardReports.bhusa.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('reports.outwardReports.bhusa.subtitle')}
                        </p>
                    </div>
                    <BhusaOutwardPrimaryButtons />
                </div>
                <BhusaOutwardTable
                    data={apiData?.entries || []}
                    search={search}
                    navigate={navigate}
                    pagination={apiData?.pagination}
                />
            </Main>
            <BhusaOutwardDialogs />
        </BhusaOutwardProvider>
    )
}
