import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { staffReport } from './staff-report-provider'

export function StaffReportPrimaryButtons() {
    const { setOpen } = staffReport()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
