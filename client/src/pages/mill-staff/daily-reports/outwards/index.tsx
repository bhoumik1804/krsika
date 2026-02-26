import { Boxes, Package, Scale, Info, ShoppingCart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DailyReportPage } from '../components/daily-report-page'

const COMMODITY_ICONS: Record<string, React.ElementType> = {
    Paddy: Boxes,
    Rice: Package,
    FRK: Scale,
    Gunny: Info,
    Khanda: ShoppingCart,
    Bhusa: ShoppingCart,
    Nakkhi: ShoppingCart,
    Silky: ShoppingCart,
    Kodha: ShoppingCart,
}

function getIcon(commodity: string) {
    for (const [key, icon] of Object.entries(COMMODITY_ICONS)) {
        if (commodity.toLowerCase().includes(key.toLowerCase())) return icon
    }
    return Boxes
}

export function OutwardsReport() {
    const { t } = useTranslation('mill-staff')

    return (
        <DailyReportPage
            action='Outward'
            title={t('dailyReports.outwards.title')}
            description={t('dailyReports.outwards.description')}
            emptyMessage={t('dailyReports.outwards.emptyMessage')}
            exportBaseFilename='outwards-report'
            EmptyIcon={Boxes}
            getIcon={getIcon}
        />
    )
}
