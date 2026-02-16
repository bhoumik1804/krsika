import { Boxes, Package, Scale, Info, ShoppingCart } from 'lucide-react'
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

export function PurchaseDealsReport() {
    return (
        <DailyReportPage
            action='Purchase Deal'
            title='Purchase Deals'
            description='Track daily purchase transactions by commodity'
            emptyMessage='No purchase deals found for the selected date range'
            exportBaseFilename='purchase-deals-report'
            EmptyIcon={ShoppingCart}
            getIcon={getIcon}
        />
    )
}
