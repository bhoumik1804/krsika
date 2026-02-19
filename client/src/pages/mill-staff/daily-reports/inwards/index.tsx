import { Boxes, Package, Scale, Info } from 'lucide-react'
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
    return (
        <DailyReportPage
            action='Inward'
            title='Inwards'
            description='Track daily inward transactions by commodity'
            emptyMessage='No inward data found for the selected date range'
            exportBaseFilename='inwards-report'
            EmptyIcon={Boxes}
            getIcon={getIcon}
        />
    )
}
