import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBrokerReport } from './broker-report-provider'

export function BrokerReportPrimaryButtons() {
    const { setOpen, setCurrentRow } = useBrokerReport()

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
