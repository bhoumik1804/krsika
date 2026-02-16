import { Boxes, Package, Scale, Info, ShoppingCart } from 'lucide-react'
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
    return ShoppingCart
}

export function SalesDealsReport() {
    const { t } = useTranslation('mill-staff')
    return (
        <DailyReportPage
            action='Sales Deal'
            title={t('dailyReports.salesDeals.title')}
            description={t('dailyReports.salesDeals.description')}
            emptyMessage={t('dailyReports.salesDeals.emptyMessage')}
            exportBaseFilename='sales-deals-report'
            EmptyIcon={ShoppingCart}
            getIcon={getIcon}
        />
    )
}
