import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFrk } from './frk-provider'

export function FrkPrimaryButtons() {
    const { setOpen } = useFrk()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Purchase
        </Button>
    )
}
