import { Boxes, Package, Scale, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DailyReportPage } from '../components/daily-report-page'

const COMMODITY_ICONS: Record<string, React.ElementType> = {
    Paddy: Boxes,
    Rice: Package,
    FRK: Scale,
    Gunny: Info,
}

function getIcon(commodity: string) {
    for (const [key, icon] of Object.entries(COMMODITY_ICONS)) {
        if (commodity.toLowerCase().includes(key.toLowerCase())) return icon
    }
    return Boxes
}

export function InwardsReport() {
    const { t } = useTranslation()
    return (
        <DailyReportPage
            action='Inward'
            title={t('inwards.title')}
            description={t('inwards.description')}
            emptyMessage={t('inwards.emptyMessage')}
            exportBaseFilename='inwards-report'
            EmptyIcon={Boxes}
            getIcon={getIcon}
        />
    )
}
