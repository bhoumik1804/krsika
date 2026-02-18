import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFrkOutward } from './frk-outward-provider'

export function FrkOutwardPrimaryButtons() {
    const { setOpen } = useFrkOutward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
