import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { labourInward } from './labour-inward-provider'

export function LabourInwardPrimaryButtons() {
    const { setOpen } = labourInward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
