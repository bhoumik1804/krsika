import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitch } from '@/components/language-switch'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { NakkhiSalesDialogs } from './components/nakkhi-sales-dialogs'
import { NakkhiSalesPrimaryButtons } from './components/nakkhi-sales-primary-buttons'
import { NakkhiSalesProvider } from './components/nakkhi-sales-provider'
import { NakkhiSalesTable } from './components/nakkhi-sales-table'
import { useNakkhiSalesList } from './data/hooks'

export function NakkhiSalesReport() {
    const { t } = useTranslation('millStaff')
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()
    const sidebarData = getMillAdminSidebarData(millId || '')

    const search = Object.fromEntries(searchParams.entries())

    // API Integration
    const {
        data: apiResponse,
        isLoading,
        isError,
    } = useNakkhiSalesList(millId || '', {
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
        <NakkhiSalesProvider
            millId={millId || ''}
            apiResponse={apiResponse}
            isLoading={isLoading}
            isError={isError}
        >
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
                            {t('reports.salesReports.nakkhi.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('reports.salesReports.nakkhi.subtitle')}
                        </p>
                    </div>
                    <NakkhiSalesPrimaryButtons />
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
                    <NakkhiSalesTable
                        data={apiResponse?.sales || []}
                        search={search}
                        navigate={navigate}
                    />
                )}
            </Main>

            <NakkhiSalesDialogs />
        </NakkhiSalesProvider>
    )
}
