import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePaddy } from './paddy-provider'

export function PaddyPrimaryButtons() {
    const { setOpen } = usePaddy()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Purchase
        </Button>
    )
}
