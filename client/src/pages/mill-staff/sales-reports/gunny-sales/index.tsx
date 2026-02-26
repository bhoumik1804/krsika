import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { GunnySalesDialogs } from './components/gunny-sales-dialogs'
import { GunnySalesPrimaryButtons } from './components/gunny-sales-primary-buttons'
import { GunnySalesProvider } from './components/gunny-sales-provider'
import { GunnySalesTable } from './components/gunny-sales-table'
import { useGunnySalesList } from './data/hooks'

export function GunnySalesReport() {
    const { t } = useTranslation('mill-staff')
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()
    const sidebarData = getMillAdminSidebarData(millId || '')

    const search = Object.fromEntries(searchParams.entries())

    // API Integration
    const {
        data: apiResponse,
        isLoading,
        isError,
    } = useGunnySalesList(millId || '', {
        page: Number(search.page) || 1,
        limit: Number(search.pageSize) || 10,
        search: search.partyName as string,
    })

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
        <GunnySalesProvider
            millId={millId || ''}
            apiResponse={apiResponse}
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
                            {t('salesReports.gunny.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('salesReports.gunny.description')}
                        </p>
                    </div>
                    <GunnySalesPrimaryButtons />
                </div>
                {isLoading ? (
                    <div className='flex items-center justify-center py-10'>
                        <div className='text-muted-foreground'>Loading...</div>
                    </div>
                ) : isError ? (
                    <div className='flex items-center justify-center py-10'>
                        <div className='text-destructive'>
                            Error loading data
                        </div>
                    </div>
                ) : (
                    <GunnySalesTable
                        data={apiResponse?.sales || []}
                        search={search}
                        navigate={navigate}
                    />
                )}
            </Main>

            <GunnySalesDialogs />
        </GunnySalesProvider>
    )
}
