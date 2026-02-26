import { Boxes, Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DailyReportPage } from '../components/daily-report-page'

function getIcon(commodity: string) {
    if (commodity.toLowerCase().includes('paddy')) return Boxes
    if (commodity.toLowerCase().includes('rice')) return Package
    return Boxes
}

export function MillingReport() {
    const { t } = useTranslation('mill-staff')

    return (
        <DailyReportPage
            action='Milling'
            title={t('dailyReports.milling.title')}
            description={t('dailyReports.milling.description')}
            emptyMessage={t('dailyReports.milling.emptyMessage')}
            exportBaseFilename='milling-report'
            EmptyIcon={Boxes}
            getIcon={getIcon}
        />
    )
}
