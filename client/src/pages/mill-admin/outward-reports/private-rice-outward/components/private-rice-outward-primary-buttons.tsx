import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePrivateRiceOutward } from './private-rice-outward-provider'

export function PrivateRiceOutwardPrimaryButtons() {
    const { setOpen } = usePrivateRiceOutward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
