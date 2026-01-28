import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { khandaOutward } from './khanda-outward-provider'

export function KhandaOutwardPrimaryButtons() {
    const { setOpen } = khandaOutward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
