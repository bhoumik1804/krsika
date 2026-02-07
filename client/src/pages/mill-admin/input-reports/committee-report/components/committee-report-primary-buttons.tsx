import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCommitteeReport } from './committee-report-provider'

export function CommitteeReportPrimaryButtons() {
    const { setOpen } = useCommitteeReport()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
