import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PrivateRiceOutward } from './private-rice-outward-provider'

export function PrivateRiceOutwardPrimaryButtons() {
    const { setOpen } = PrivateRiceOutward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
