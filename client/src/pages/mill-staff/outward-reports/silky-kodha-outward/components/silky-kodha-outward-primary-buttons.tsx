import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { silkyKodhaOutward } from './silky-kodha-outward-provider'

export function SilkyKodhaOutwardPrimaryButtons() {
    const { setOpen } = silkyKodhaOutward()
    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
