import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { brokerReport } from './broker-report-provider'

export function BrokerReportPrimaryButtons() {
    const { setOpen } = brokerReport()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
