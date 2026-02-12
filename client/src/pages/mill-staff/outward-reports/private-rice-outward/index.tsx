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
import { PrivateRiceOutwardDialogs } from './components/private-rice-outward-dialogs'
import { PrivateRiceOutwardPrimaryButtons } from './components/private-rice-outward-primary-buttons'
import { PrivateRiceOutwardProvider } from './components/private-rice-outward-provider'
import { PrivateRiceOutwardTable } from './components/private-rice-outward-table'
import { usePrivateRiceOutwardList } from './data/hooks'
import type { PrivateRiceOutwardQueryParams } from './data/types'

function PrivateRiceOutwardContent() {
    const { t } = useTranslation('millStaff')
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()

    const search = Object.fromEntries(searchParams.entries())

    const queryParams = useMemo(
        () => ({
            page: search.page ? parseInt(search.page as string, 10) : 1,
            limit: search.limit ? parseInt(search.limit as string, 10) : 10,
            search: search.search ? (search.search as string) : undefined,
            startDate: search.startDate
                ? (search.startDate as string)
                : undefined,
            endDate: search.endDate ? (search.endDate as string) : undefined,
            sortBy:
                (search.sortBy as PrivateRiceOutwardQueryParams['sortBy']) ||
                'date',
            sortOrder:
                (search.sortOrder as PrivateRiceOutwardQueryParams['sortOrder']) ||
                'desc',
        }),
        [search]
    )

    const {
        data: listData,
        isLoading,
        error,
    } = usePrivateRiceOutwardList(millId || '', queryParams)

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

    const data = listData?.entries ?? []
    const serverPagination = listData?.pagination

    if (isLoading) {
        return (
            <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>
                            {t('reports.outwardReports.privateRice.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('reports.outwardReports.privateRice.subtitle')}
                        </p>
                    </div>
                </div>
                <div className='flex items-center justify-center rounded-md border border-dashed p-8'>
                    <p className='text-muted-foreground'>Loading...</p>
                </div>
            </Main>
        )
    }

    if (error) {
        return (
            <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>
                            {t('reports.outwardReports.privateRice.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('reports.outwardReports.privateRice.subtitle')}
                        </p>
                    </div>
                </div>
                <div className='flex items-center justify-center rounded-md border border-dashed border-destructive p-8'>
                    <p className='text-destructive'>
                        Error loading data: {error.message}
                    </p>
                </div>
            </Main>
        )
    }

    return (
        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
            <div className='flex flex-wrap items-end justify-between gap-2'>
                <div>
                    <h2 className='text-2xl font-bold tracking-tight'>
                        {t('reports.outwardReports.privateRice.title')}
                    </h2>
                    <p className='text-muted-foreground'>
                        {t('reports.outwardReports.privateRice.subtitle')}
                    </p>
                </div>
                <PrivateRiceOutwardPrimaryButtons />
            </div>
            <PrivateRiceOutwardTable
                data={data}
                search={search}
                navigate={navigate}
                pagination={serverPagination}
            />
        </Main>
    )
}

export function PrivateRiceOutwardReport() {
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')

    return (
        <PrivateRiceOutwardProvider millId={millId || ''}>
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

            <PrivateRiceOutwardContent />

            <PrivateRiceOutwardDialogs />
        </PrivateRiceOutwardProvider>
    )
}
