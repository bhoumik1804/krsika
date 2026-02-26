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
import { FinancialPaymentDialogs } from './components/financial-payment-dialogs'
import { FinancialPaymentPrimaryButtons } from './components/financial-payment-primary-buttons'
import { FinancialPaymentProvider } from './components/financial-payment-provider'
import { FinancialPaymentTable } from './components/financial-payment-table'
import { useFinancialPaymentList } from './data/hooks'

export function FinancialPaymentReport() {
    const { t } = useTranslation('mill-staff')
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()

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
            paymentType: search.paymentType as string | undefined,
            startDate: search.startDate as string | undefined,
            endDate: search.endDate as string | undefined,
            sortBy: (search.sortBy as string) || 'date',
            sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
        }
    }, [searchParams])

    const sidebarData = getMillAdminSidebarData(millId || '')

    const { data, isLoading, isError } = useFinancialPaymentList(
        millId || '',
        queryParams
    )

    const navigate = (opts: { search: unknown; replace?: boolean }) => {
        const search = Object.fromEntries(searchParams.entries())
        if (typeof opts.search === 'function') {
            const newSearch = opts.search(search)
            setSearchParams(newSearch as Record<string, string>)
        } else if (opts.search === true) {
            // Keep current params
        } else {
            setSearchParams(opts.search as Record<string, string>)
        }
    }

    if (isLoading && !data) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <LoadingSpinner />
            </div>
        )
    }

    if (isError) {
        return (
            <div className='flex h-screen items-center justify-center text-red-500'>
                Failed to load data. Please try again later.
            </div>
        )
    }

    return (
        <FinancialPaymentProvider>
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
                            {t('financialTransactionReports.payment.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t(
                                'financialTransactionReports.payment.description'
                            )}
                        </p>
                    </div>
                    <FinancialPaymentPrimaryButtons />
                </div>
                <FinancialPaymentTable
                    data={data?.entries || []}
                    search={Object.fromEntries(
                        Object.entries(queryParams || {})
                            .filter(([, value]) => value !== undefined)
                            .map(([key, value]) => [key, String(value)])
                    )}
                    navigate={navigate}
                    pagination={data?.pagination}
                    isLoading={isLoading}
                />
            </Main>

            <FinancialPaymentDialogs />
        </FinancialPaymentProvider>
    )
}
