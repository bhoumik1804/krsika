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
import { VehicleReportDialogs } from './components/vehicle-report-dialogs'
import { VehicleReportPrimaryButtons } from './components/vehicle-report-primary-buttons'
import { VehicleReportProvider } from './components/vehicle-report-provider'
import { VehicleReportTable } from './components/vehicle-report-table'
import { useVehicleList } from './data/hooks'

export function VehicleReport() {
    const { millId } = useParams<{ millId: string }>()
    const { t } = useTranslation('mill-staff')
    const [searchParams, setSearchParams] = useSearchParams()
    const sidebarData = getMillAdminSidebarData(millId || '')

    const search = Object.fromEntries(searchParams.entries())

    const queryParams = useMemo(
        () => ({
            millId: millId || '',
            page: search.page ? parseInt(search.page as string, 10) : 1,
            limit: search.limit ? parseInt(search.limit as string, 10) : 10,
            search: search.search as string | undefined,
            sortBy: (search.sortBy as string) || 'createdAt',
            sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
        }),
        [search, millId]
    )

    const { data: response, isLoading, isError } = useVehicleList(queryParams)

    const vehicleData = useMemo(
        () =>
            response?.vehicles.map((vehicle) => ({
                _id: vehicle._id,
                truckNo: vehicle.truckNo || '',
            })) ?? [],
        [response]
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
        <VehicleReportProvider millId={millId || ''}>
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
                            {t('inputReports.vehicle.title')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('inputReports.vehicle.description')}
                        </p>
                    </div>
                    <VehicleReportPrimaryButtons />
                </div>
                <VehicleReportTable
                    data={vehicleData}
                    search={search}
                    navigate={navigate}
                    isLoading={isLoading}
                    isError={isError}
                    pagination={response?.pagination}
                />
            </Main>

            <VehicleReportDialogs />
        </VehicleReportProvider>
    )
}
