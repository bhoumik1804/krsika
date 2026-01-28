import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOther } from './other-provider'

export function OtherPrimaryButtons() {
    const { setOpen } = useOther()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Purchase
        </Button>
    )
}
