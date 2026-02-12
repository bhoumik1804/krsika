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
import { OtherSalesDialogs } from './components/other-sales-dialogs'
import { OtherSalesPrimaryButtons } from './components/other-sales-primary-buttons'
import { OtherSalesProvider } from './components/other-sales-provider'
import { OtherSalesTable } from './components/other-sales-table'
import { otherSalesEntries } from './data/other-sales-entries'

export function OtherSalesReport() {
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

    return (
        <OtherSalesProvider>
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
                            {t('reports.salesReports.other.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('reports.salesReports.other.subtitle')}
                        </p>
                    </div>
                    <OtherSalesPrimaryButtons />
                </div>
                <OtherSalesTable
                    data={otherSalesEntries}
                    search={search}
                    navigate={navigate}
                />
            </Main>

            <OtherSalesDialogs />
        </OtherSalesProvider>
    )
}
