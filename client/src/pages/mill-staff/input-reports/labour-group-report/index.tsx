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
import { LabourGroupReportDialogs } from './components/labour-group-report-dialogs'
import { LabourGroupReportPrimaryButtons } from './components/labour-group-report-primary-buttons'
import {
    LabourGroupReportProvider,
    useLabourGroupReport,
} from './components/labour-group-report-provider'
import { LabourGroupReportTable } from './components/labour-group-report-table'

export function LabourGroupReport() {
    const { millId } = useParams<{ millId: string }>()
    const { t } = useTranslation('mill-staff')
    const [searchParams, setSearchParams] = useSearchParams()
    const sidebarData = getMillAdminSidebarData(millId || '')

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
        <LabourGroupReportProvider
            millId={millId || ''}
            initialQueryParams={queryParams}
        >
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
                            {t('inputReports.labourGroup.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('inputReports.labourGroup.description')}
                        </p>
                    </div>
                    <LabourGroupReportPrimaryButtons />
                </div>
                <LabourGroupReportContent navigate={navigate} />
            </Main>

            <LabourGroupReportDialogs />
        </LabourGroupReportProvider>
    )
}

function LabourGroupReportContent({
    navigate,
}: {
    navigate: (opts: { search: unknown; replace?: boolean }) => void
}) {
    const context = useLabourGroupReport()

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
                Failed to load labour group data. Please try again later.
            </div>
        )
    }

    return (
        <LabourGroupReportTable
            data={context.data}
            search={Object.fromEntries(
                Object.entries(context.queryParams || {})
                    .filter(([, value]) => value !== undefined)
                    .map(([key, value]) => [key, String(value)])
            )}
            navigate={navigate}
            pagination={context.pagination}
        />
    )
}
