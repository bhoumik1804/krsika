import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { labourOutward } from './labour-outward-provider'

export function LabourOutwardPrimaryButtons() {
    const { setOpen } = labourOutward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
