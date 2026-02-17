import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { GovtGunnyOutwardDialogs } from './components/govt-gunny-outward-dialogs'
import { GovtGunnyOutwardPrimaryButtons } from './components/govt-gunny-outward-primary-buttons'
import { GovtGunnyOutwardProvider } from './components/govt-gunny-outward-provider'
import { GovtGunnyOutwardTable } from './components/govt-gunny-outward-table'
import { useGovtGunnyOutwardList } from './data/hooks'
import type { GovtGunnyOutwardQueryParams } from './data/types'

function GovtGunnyOutwardContent() {
    const { t } = useTranslation('mill-staff')
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
                (search.sortBy as GovtGunnyOutwardQueryParams['sortBy']) ||
                'date',
            sortOrder:
                (search.sortOrder as GovtGunnyOutwardQueryParams['sortOrder']) ||
                'desc',
        }),
        [search]
    )

    const {
        data: listData,
        isLoading,
        error,
    } = useGovtGunnyOutwardList(millId || '', queryParams)

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
                            {t('govtGunnyOutward.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('govtGunnyOutward.description')}
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
                            {t('govtGunnyOutward.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('govtGunnyOutward.description')}
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
                        {t('govtGunnyOutward.title')}
                    </h2>
                    <p className='text-muted-foreground'>
                        {t('govtGunnyOutward.description')}
                    </p>
                </div>
                <GovtGunnyOutwardPrimaryButtons />
            </div>
            <GovtGunnyOutwardTable
                data={data}
                search={search}
                navigate={navigate}
                pagination={serverPagination}
            />
        </Main>
    )
}

export function GovtGunnyOutwardReport() {
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')

    return (
        <GovtGunnyOutwardProvider millId={millId || ''}>
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

            <GovtGunnyOutwardContent />

            <GovtGunnyOutwardDialogs />
        </GovtGunnyOutwardProvider>
    )
}
