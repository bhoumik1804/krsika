import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDoReport } from './do-report-provider'

export function DoReportPrimaryButtons() {
    const { setOpen, setCurrentRow } = useDoReport()

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
