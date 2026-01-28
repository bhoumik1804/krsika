import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { otherOutward } from './other-outward-provider'

export function OtherOutwardPrimaryButtons() {
    const { setOpen } = otherOutward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
