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
import { SilkyKodhaOutwardDialogs } from './components/silky-kodha-outward-dialogs'
import { SilkyKodhaOutwardPrimaryButtons } from './components/silky-kodha-outward-primary-buttons'
import { SilkyKodhaOutwardProvider } from './components/silky-kodha-outward-provider'
import { SilkyKodhaOutwardTable } from './components/silky-kodha-outward-table'
import { useSilkyKodhaOutwardList } from './data/hooks'

export function SilkyKodhaOutwardReport() {
    const { t } = useTranslation('mill-staff')
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
            | 'netWeight'
            | 'createdAt'
            | undefined,
        sortOrder: search.sortOrder as 'asc' | 'desc' | undefined,
    }

    const {
        data: apiData,
        isLoading,
        error,
    } = useSilkyKodhaOutwardList(millId || '', queryParams)

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
        <SilkyKodhaOutwardProvider millId={millId || ''} apiData={apiData}>
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
                            {t('outward.silkyKodhaOutward.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('outward.silkyKodhaOutward.description')}
                        </p>
                    </div>
                    <SilkyKodhaOutwardPrimaryButtons />
                </div>
                <SilkyKodhaOutwardTable
                    data={apiData?.entries || []}
                    search={search}
                    navigate={navigate}
                    pagination={apiData?.pagination}
                />
            </Main>
            <SilkyKodhaOutwardDialogs />
        </SilkyKodhaOutwardProvider>
    )
}
