import { Package, ShoppingCart } from 'lucide-react'
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
    return (
        <DailyReportPage
            action='Production'
            title='Production'
            description='Track daily production output by commodity'
            emptyMessage='No production data found for the selected date range'
            exportBaseFilename='production-report'
            EmptyIcon={Package}
            getIcon={getIcon}
            gridCols='sm:grid-cols-2 lg:grid-cols-4'
        />
    )
}
