import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { labourOther } from './labour-other-provider'

export function LabourOtherPrimaryButtons() {
    const { setOpen } = labourOther()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
