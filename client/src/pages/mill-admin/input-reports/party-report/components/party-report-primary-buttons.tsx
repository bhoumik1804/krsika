import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePartyReport } from './party-report-provider'

export function PartyReportPrimaryButtons() {
    const { setOpen } = usePartyReport()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
