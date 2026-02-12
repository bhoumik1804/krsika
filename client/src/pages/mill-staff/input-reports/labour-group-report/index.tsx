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
import { LabourGroupReportDialogs } from './components/labour-group-report-dialogs'
import { LabourGroupReportPrimaryButtons } from './components/labour-group-report-primary-buttons'
import { LabourGroupReportProvider } from './components/labour-group-report-provider'
import { LabourGroupReportTable } from './components/labour-group-report-table'
import { useLabourGroupList } from './data/hooks'

export function LabourGroupReport() {
    const { t } = useTranslation('millStaff')
    const { millId } = useParams<{ millId: string }>()
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

    const {
        data: response,
        isLoading,
        isError,
    } = useLabourGroupList(millId || '', queryParams, { enabled: !!millId })

    const labourGroupData = useMemo(() => {
        const list = response?.labourGroups || []
        return Array.isArray(list)
            ? list.map((group) => ({
                  _id: group._id,
                  labourTeamName: group.groupName || '',
              }))
            : []
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
        <LabourGroupReportProvider>
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
                            {t('reports.inputReports.labourGroup.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('reports.inputReports.labourGroup.subtitle')}
                        </p>
                    </div>
                    <LabourGroupReportPrimaryButtons />
                </div>
                <LabourGroupReportTable
                    data={labourGroupData}
                    search={search}
                    navigate={navigate}
                    isLoading={isLoading}
                    isError={isError}
                    pagination={response?.pagination}
                />
            </Main>

            <LabourGroupReportDialogs />
        </LabourGroupReportProvider>
    )
}
