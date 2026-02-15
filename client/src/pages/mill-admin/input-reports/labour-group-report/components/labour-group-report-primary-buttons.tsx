import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLabourGroupReport } from './labour-group-report-provider'

export function LabourGroupReportPrimaryButtons() {
    const { setOpen } = useLabourGroupReport()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
