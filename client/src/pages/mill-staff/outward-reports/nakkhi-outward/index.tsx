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
import { NakkhiOutwardDialogs } from './components/nakkhi-outward-dialogs'
import { NakkhiOutwardPrimaryButtons } from './components/nakkhi-outward-primary-buttons'
import { NakkhiOutwardProvider } from './components/nakkhi-outward-provider'
import { NakkhiOutwardTable } from './components/nakkhi-outward-table'
import { useNakkhiOutwardList } from './data/hooks'

export function NakkhiOutwardReport() {
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

    const {
        data: apiData,
        isLoading,
        isError,
    } = useNakkhiOutwardList(millId || '', {
        page: search.page ? Number(search.page) : 1,
        limit: search.limit ? Number(search.limit) : 10,
        partyName: search.partyName as string,
    })

    if (isLoading) {
        return (
            <Main className='flex flex-1 items-center justify-center'>
                <LoadingSpinner />
            </Main>
        )
    }

    if (isError) {
        return (
            <Main className='flex flex-1 items-center justify-center'>
                <p className='text-destructive'>
                    {t('common.errorLoadingData')}
                </p>
            </Main>
        )
    }

    return (
        <NakkhiOutwardProvider millId={millId || ''} apiData={apiData}>
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
                            {t('nakkhiOutward.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('nakkhiOutward.description')}
                        </p>
                    </div>
                    <NakkhiOutwardPrimaryButtons />
                </div>
                <NakkhiOutwardTable
                    data={apiData?.entries || []}
                    search={search}
                    navigate={navigate}
                    pagination={apiData?.pagination}
                />
            </Main>

            <NakkhiOutwardDialogs millId={millId || ''} />
        </NakkhiOutwardProvider>
    )
}
