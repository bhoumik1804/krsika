import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { transporterReport } from './transporter-report-provider'

export function TransporterReportPrimaryButtons() {
    const { setOpen } = transporterReport()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
