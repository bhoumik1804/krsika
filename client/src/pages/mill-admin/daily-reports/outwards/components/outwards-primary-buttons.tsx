import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOutwards } from './outwards-provider'

export function OutwardsPrimaryButtons() {
    const { setOpen } = useOutwards()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Outward
        </Button>
    )
}
