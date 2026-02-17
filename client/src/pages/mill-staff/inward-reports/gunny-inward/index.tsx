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
import { GunnyInwardDialogs } from './components/gunny-inward-dialogs'
import { GunnyInwardPrimaryButtons } from './components/gunny-inward-primary-buttons'
import {
    GunnyInwardProvider,
    gunnyInward,
} from './components/gunny-inward-provider'
import { GunnyInwardTable } from './components/gunny-inward-table'

function GunnyInwardContent() {
    const { t } = useTranslation('mill-staff')
    const [searchParams, setSearchParams] = useSearchParams()
    const { data, isLoading, error, setQueryParams } = gunnyInward()

    const search = Object.fromEntries(searchParams.entries())

    const navigate = (opts: { search: unknown; replace?: boolean }) => {
        if (typeof opts.search === 'function') {
            const newSearch = opts.search(search)
            const params = newSearch as Record<string, string>
            setSearchParams(params)
            setQueryParams((prev) => ({
                ...prev,
                page: params.page ? parseInt(params.page) : 1,
                search: params.search,
                sortBy: params.sortBy,
                sortOrder: params.sortOrder as 'asc' | 'desc' | undefined,
            }))
        } else if (opts.search === true) {
            // Keep current params
        } else {
            const params = opts.search as Record<string, string>
            setSearchParams(params)
            setQueryParams((prev) => ({
                ...prev,
                page: params.page ? parseInt(params.page) : 1,
                search: params.search,
                sortBy: params.sortBy,
                sortOrder: params.sortOrder as 'asc' | 'desc' | undefined,
            }))
        }
    }

    if (error) {
        return (
            <Main className='flex flex-1 flex-col items-center justify-center'>
                <div className='text-center'>
                    <h2 className='text-2xl font-bold text-destructive'>
                        {t('common.errorLoadingData')}
                    </h2>
                    <p className='mt-2 text-muted-foreground'>
                        {error.message || t('gunnyInward.errorLoading')}
                    </p>
                </div>
            </Main>
        )
    }

    return (
        <>
            <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>
                            {t('gunnyInward.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('gunnyInward.description')}
                        </p>
                    </div>
                    <GunnyInwardPrimaryButtons />
                </div>
                {isLoading ? (
                    <div className='flex items-center justify-center py-8'>
                        <LoadingSpinner />
                    </div>
                ) : (
                    <GunnyInwardTable
                        data={data}
                        search={search}
                        navigate={navigate}
                    />
                )}
            </Main>

            <GunnyInwardDialogs />
        </>
    )
}

export function GunnyInwardReport() {
    const { t } = useTranslation('mill-staff')
    const { millId } = useParams<{ millId: string }>()
    const sidebarData = getMillAdminSidebarData(millId || '')

    if (!millId) {
        return (
            <Main className='flex flex-1 flex-col items-center justify-center'>
                <div className='text-center'>
                    <h2 className='text-2xl font-bold text-destructive'>
                        {t('common.millIdRequired')}
                    </h2>
                </div>
            </Main>
        )
    }

    return (
        <GunnyInwardProvider millId={millId}>
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

            <GunnyInwardContent />
        </GunnyInwardProvider>
    )
}
