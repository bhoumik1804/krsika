import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { bhusaOutward } from './bhusa-outward-provider'

export function BhusaOutwardPrimaryButtons() {
    const { setOpen } = bhusaOutward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
