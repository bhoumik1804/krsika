import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { partyReport } from './party-report-provider'

export function PartyReportPrimaryButtons() {
    const { setOpen, setCurrentRow } = partyReport()

    return (
        <Button onClick={() => {
            setCurrentRow(null)
            setOpen('add')
        }}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
