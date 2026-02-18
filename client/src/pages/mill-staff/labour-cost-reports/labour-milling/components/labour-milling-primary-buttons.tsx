import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { labourMilling } from './labour-milling-provider'

export function LabourMillingPrimaryButtons() {
    const { setOpen } = labourMilling()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
