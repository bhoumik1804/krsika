import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { committeeReport } from './committee-report-provider'

export function CommitteeReportPrimaryButtons() {
    const { setOpen, setCurrentRow } = committeeReport()

    const handleAddClick = () => {
        setCurrentRow(null)
        setOpen('add')
    }

    return (
        <Button onClick={handleAddClick}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
