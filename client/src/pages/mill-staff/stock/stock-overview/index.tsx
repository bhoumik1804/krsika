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
import { StockOverviewCards } from './components/stock-overview-cards'
import { StockOverviewDialogs } from './components/stock-overview-dialogs'
import { StockOverviewPrimaryButtons } from './components/stock-overview-primary-buttons'
import { StockOverviewProvider } from './components/stock-overview-provider'
import { useStockOverviewList, useStockOverviewSummary } from './data/hooks'

export function StockOverviewReport() {
    const { t } = useTranslation('millStaff')
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, _setSearchParams] = useSearchParams()
    const sidebarData = getMillAdminSidebarData(millId || '')

    const search = Object.fromEntries(searchParams.entries())

    // Extract query params from URL
    const queryParams = useMemo(
        () => ({
            page: search.page ? parseInt(search.page as string, 10) : 1,
            limit: search.limit ? parseInt(search.limit as string, 10) : 10,
            search: search.search as string | undefined,
            status: search.status as
                | 'pending'
                | 'completed'
                | 'cancelled'
                | undefined,
            startDate: search.startDate as string | undefined,
            endDate: search.endDate as string | undefined,
            sortBy: (search.sortBy as string) || 'date',
            sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
        }),
        [search]
    )

    // Fetch stock overview data using the hook
    const {
        data: stockResponse,
        isLoading,
        isError,
    } = useStockOverviewList(millId || '', queryParams, { enabled: !!millId })

    // Fetch summary data
    const { data: _summaryResponse } = useStockOverviewSummary(
        millId || '',
        { startDate: queryParams.startDate, endDate: queryParams.endDate },
        { enabled: !!millId }
    )

    // Transform API response to component format
    const stockData = useMemo(() => {
        if (!stockResponse?.data) return []
        return stockResponse.data.map((item) => ({
            date: item.date,
            partyName: item.partyName,
            vehicleNumber: item.vehicleNumber,
            bags: item.bags,
            weight: item.weight,
            rate: item.rate,
            amount: item.amount,
            status: item.status,
            remarks: item.remarks,
        }))
    }, [stockResponse])

    return (
        <StockOverviewProvider>
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
                            {t('reports.stockReports.overview.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('reports.stockReports.overview.subtitle')}
                        </p>
                    </div>
                    <StockOverviewPrimaryButtons />
                </div>
                {isLoading ? (
                    <LoadingSpinner className='h-full w-full' />
                ) : isError ? (
                    <div className='py-10 text-center text-destructive'>
                        Failed to load stock overview data
                    </div>
                ) : (
                    <StockOverviewCards data={stockData} />
                )}
            </Main>

            <StockOverviewDialogs />
        </StockOverviewProvider>
    )
}
