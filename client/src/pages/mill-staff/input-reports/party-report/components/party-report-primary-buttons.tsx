import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePartyReport } from './party-report-provider'

export function PartyReportPrimaryButtons() {
    const { setOpen, setCurrentRow } = usePartyReport()

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
