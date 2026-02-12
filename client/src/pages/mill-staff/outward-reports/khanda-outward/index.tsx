import { useParams, useSearchParams } from 'react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { getMillAdminSidebarData } from '@/components/layout/data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { KhandaOutwardDialogs } from './components/khanda-outward-dialogs'
import { KhandaOutwardPrimaryButtons } from './components/khanda-outward-primary-buttons'
import { KhandaOutwardProvider } from './components/khanda-outward-provider'
import { KhandaOutwardTable } from './components/khanda-outward-table'
import { useKhandaOutwardList } from './data/hooks'

export function KhandaOutwardReport() {
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
    } = useKhandaOutwardList(millId || '', {
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
                    Failed to load khanda outward data
                </p>
            </Main>
        )
    }

    return (
        <KhandaOutwardProvider millId={millId || ''} apiData={apiData}>
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
                            Khanda Outward Report
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage khanda outward transactions and records
                        </p>
                    </div>
                    <KhandaOutwardPrimaryButtons />
                </div>
                <KhandaOutwardTable
                    data={apiData?.entries || []}
                    search={search}
                    navigate={navigate}
                    pagination={apiData?.pagination}
                />
            </Main>

            <KhandaOutwardDialogs millId={millId || ''} />
        </KhandaOutwardProvider>
    )
}
