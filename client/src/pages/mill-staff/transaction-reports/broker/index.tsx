import { useMemo } from 'react'
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
import { BrokerTransactionTable } from './components/broker-table'
import { BrokerTransactionDialogs } from './components/broker-transaction-dialogs'
import { BrokerTransactionPrimaryButtons } from './components/broker-transaction-primary-buttons'
import { BrokerTransactionProvider } from './components/broker-transaction-provider'
import { useBrokerTransactionList } from './data/hooks'

export function TransactionBrokerReport() {
    const { t } = useTranslation('millStaff')
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()
    const sidebarData = getMillAdminSidebarData(millId || '')

    // Convert URLSearchParams to record
    const search = Object.fromEntries(searchParams.entries())

    const queryParams = useMemo(
        () => ({
            page: search.page ? parseInt(search.page as string, 10) : 1,
            limit: search.limit ? parseInt(search.limit as string, 10) : 10,
            search: search.search as string | undefined,
            sortBy: (search.sortBy as string) || 'createdAt',
            sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
        }),
        [search]
    )

    const {
        data: response,
        isLoading,
        isError,
    } = useBrokerTransactionList(millId || '', queryParams, {
        enabled: !!millId,
    })

    const brokerTransactionData = useMemo(() => {
        if (!response?.data) return []
        return response.data.map((item) => ({
            id: item._id,
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
        }))
    }, [response])

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
        <BrokerTransactionProvider>
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
                            {t('reports.transactionReports.broker.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('reports.transactionReports.broker.subtitle')}
                        </p>
                    </div>
                    <BrokerTransactionPrimaryButtons />
                </div>
                <BrokerTransactionTable
                    data={brokerTransactionData}
                    isLoading={isLoading}
                    isError={isError}
                    search={search}
                    navigate={navigate}
                />
            </Main>

            <BrokerTransactionDialogs />
        </BrokerTransactionProvider>
    )
}
