import {
    Boxes,
    Package,
    Scale,
    Info,
    ShoppingCart,
} from 'lucide-react'
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
    return (
        <DailyReportPage
            action='Outward'
            title='Outwards'
            description='Track daily outward transactions by commodity'
            emptyMessage='No outward data found for the selected date range'
            exportBaseFilename='outwards-report'
            EmptyIcon={Boxes}
            getIcon={getIcon}
        />
    )
}
