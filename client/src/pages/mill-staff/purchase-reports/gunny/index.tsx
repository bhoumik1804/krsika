import { useMemo, useCallback } from 'react'
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
import { GunnyDialogs } from './components/gunny-dialogs'
import { GunnyPrimaryButtons } from './components/gunny-primary-buttons'
import { GunnyProvider, useGunny } from './components/gunny-provider'
import { GunnyTable } from './components/gunny-table'
import { useGunnyPurchaseList } from './data/hooks'
import type { GunnyPurchaseQueryParams } from './data/types'

export function GunnyPurchaseReport() {
    const { t } = useTranslation('millStaff')
    const { millId } = useParams<{ millId: string }>()
    const [searchParams, setSearchParams] = useSearchParams()

    // Extract query params from URL
    const queryParams = useMemo((): GunnyPurchaseQueryParams => {
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
            sortBy: (search.sortBy as string) || 'createdAt',
            sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
        }
    }, [searchParams])

    // Call GET API here
    const {
        data: apiResponse,
        isLoading,
        isError,
    } = useGunnyPurchaseList(millId || '', queryParams)

    const sidebarData = getMillAdminSidebarData(millId || '')

    // Convert URLSearchParams to record
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

    const handleQueryParamsChange = useCallback(
        (params: GunnyPurchaseQueryParams) => {
            const newParams: Record<string, string> = {
                page: params.page?.toString() || '1',
                limit: params.limit?.toString() || '10',
            }
            if (params.search) {
                newParams.search = params.search
            }
            if (params.sortBy) {
                newParams.sortBy = params.sortBy
            }
            if (params.sortOrder) {
                newParams.sortOrder = params.sortOrder
            }
            setSearchParams(newParams, { replace: true })
        },
        [setSearchParams]
    )

    return (
        <GunnyProvider
            millId={millId || ''}
            initialQueryParams={queryParams}
            apiData={apiResponse}
            isLoading={isLoading}
            isError={isError}
            onQueryParamsChange={handleQueryParamsChange}
        >
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
                            {t('reports.purchaseReports.gunny.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('reports.purchaseReports.gunny.subtitle')}
                        </p>
                    </div>
                    <GunnyPrimaryButtons />
                </div>
                <GunnyPurchaseContent navigate={navigate} />
            </Main>

            <GunnyDialogs />
        </GunnyProvider>
    )
}

// Separate component to use context hook
function GunnyPurchaseContent({
    navigate,
}: {
    navigate: (opts: { search: unknown; replace?: boolean }) => void
}) {
    const context = useGunny()

    if (context.isLoading) {
        return (
            <div className='flex items-center justify-center py-10'>
                <LoadingSpinner />
            </div>
        )
    }

    if (context.isError) {
        return (
            <div className='py-10 text-center text-red-500'>
                Failed to load gunny purchase data. Please try again later.
            </div>
        )
    }

    return (
        <GunnyTable
            data={context.data}
            search={Object.fromEntries(
                Object.entries(context.queryParams || {})
                    .filter(([, value]) => value !== undefined)
                    .map(([key, value]) => [key, String(value)])
            )}
            navigate={navigate}
        />
    )
}
