import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTransporterReport } from './transporter-report-provider'

export function TransporterReportPrimaryButtons() {
    const { setOpen } = useTransporterReport()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
