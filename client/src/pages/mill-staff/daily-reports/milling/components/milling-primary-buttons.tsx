import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMilling } from './milling-provider'

export function MillingPrimaryButtons() {
    const { setOpen } = useMilling()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Entry
        </Button>
    )
}
