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

export function SalesDealsReport() {
    return (
        <DailyReportPage
            action='Sales Deal,Sale'
            title='Sales Deals'
            description='Track daily sales transactions by commodity'
            emptyMessage='No sales deals found for the selected date range'
            exportBaseFilename='sales-deals-report'
            EmptyIcon={ShoppingCart}
            getIcon={getIcon}
        />
    )
}
