import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { kodhaOutward } from './kodha-outward-provider'

export function KodhaOutwardPrimaryButtons() {
    const { setOpen } = kodhaOutward()
    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
