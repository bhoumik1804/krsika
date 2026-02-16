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
import { OtherSalesDialogs } from './components/other-sales-dialogs'
import { OtherSalesPrimaryButtons } from './components/other-sales-primary-buttons'
import {
    OtherSalesProvider,
    useOtherSales,
} from './components/other-sales-provider'
import { OtherSalesTable } from './components/other-sales-table'

export function OtherSalesReport() {
    const { t } = useTranslation('mill-staff')
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

    const queryParams = {
        page: Number(search.page) || 1,
        limit: Number(search.limit) || 10,
        sortBy: search.sortBy || 'date',
        sortOrder: (search.sortOrder || 'desc') as 'asc' | 'desc',
        search: search.search || undefined,
    }

    return (
        <OtherSalesProvider millId={millId || ''} queryParams={queryParams}>
            <Header fixed>
                <Search placeholder={t('otherSales.form.placeholders.party')} />
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
                            {t('otherSales.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('otherSales.description')}
                        </p>
                    </div>
                    <OtherSalesPrimaryButtons />
                </div>
                <OtherSalesContent search={search} navigate={navigate} />
            </Main>

            <OtherSalesDialogs />
        </OtherSalesProvider>
    )
}

function OtherSalesContent({
    search,
    navigate,
}: {
    search: Record<string, string>
    navigate: (opts: { search: unknown; replace?: boolean }) => void
}) {
    const { t } = useTranslation('mill-staff')
    const { data, isLoading, pagination } = useOtherSales()

    if (isLoading) {
        return (
            <div className='flex items-center justify-center py-10'>
                <LoadingSpinner />
                <div className='ml-2 text-muted-foreground'>
                    {t('common.loading')}
                </div>
            </div>
        )
    }

    return (
        <>
            <OtherSalesTable
                data={data}
                search={search}
                navigate={navigate}
                pagination={pagination}
            />
        </>
    )
}
