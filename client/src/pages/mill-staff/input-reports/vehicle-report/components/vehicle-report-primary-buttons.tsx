import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { vehicleReport } from './vehicle-report-provider'

export function VehicleReportPrimaryButtons() {
    const { setOpen } = vehicleReport()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
