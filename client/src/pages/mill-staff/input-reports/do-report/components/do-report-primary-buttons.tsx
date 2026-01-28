import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { doReport } from './do-report-provider'

export function DoReportPrimaryButtons() {
    const { setOpen } = doReport()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
