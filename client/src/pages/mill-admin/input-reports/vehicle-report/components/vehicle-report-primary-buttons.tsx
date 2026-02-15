import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useVehicleReport } from './vehicle-report-provider'

export function VehicleReportPrimaryButtons() {
    const { setOpen, setCurrentRow } = useVehicleReport()

    return (
        <Button
            onClick={() => {
                setCurrentRow(null)
                setOpen('add')
            }}
        >
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
