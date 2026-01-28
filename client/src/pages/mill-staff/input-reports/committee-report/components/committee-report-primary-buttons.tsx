import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { committeeReport } from './committee-report-provider'

export function CommitteeReportPrimaryButtons() {
    const { setOpen } = committeeReport()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
