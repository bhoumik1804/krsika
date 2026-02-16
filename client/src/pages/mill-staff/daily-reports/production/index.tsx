import { Package, ShoppingCart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DailyReportPage } from '../components/daily-report-page'

const COMMODITY_ICONS: Record<string, React.ElementType> = {
    Rice: Package,
    Khanda: ShoppingCart,
    Kodha: ShoppingCart,
    Bhusa: ShoppingCart,
    Nakkhi: ShoppingCart,
    Silky: ShoppingCart,
}

function getIcon(commodity: string) {
    for (const [key, icon] of Object.entries(COMMODITY_ICONS)) {
        if (commodity.toLowerCase().includes(key.toLowerCase())) return icon
    }
    return Package
}

export function ProductionReport() {
    const { t } = useTranslation('mill-staff')
    return (
        <DailyReportPage
            action='Production'
            title={t('production.title')}
            description={t('production.description')}
            emptyMessage={t('production.emptyMessage')}
            exportBaseFilename='production-report'
            EmptyIcon={Package}
            getIcon={getIcon}
            gridCols='sm:grid-cols-2 lg:grid-cols-4'
        />
    )
}

