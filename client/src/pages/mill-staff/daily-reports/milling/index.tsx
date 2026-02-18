import { Boxes, Package } from 'lucide-react'
import { DailyReportPage } from '../components/daily-report-page'

function getIcon(commodity: string) {
    if (commodity.toLowerCase().includes('paddy')) return Boxes
    if (commodity.toLowerCase().includes('rice')) return Package
    return Boxes
}

export function MillingReport() {
    return (
        <DailyReportPage
            action='Milling'
            title='Milling'
            description='Track daily milling operations by commodity'
            emptyMessage='No milling data found for the selected date range'
            exportBaseFilename='milling-report'
            EmptyIcon={Boxes}
            getIcon={getIcon}
        />
    )
}
