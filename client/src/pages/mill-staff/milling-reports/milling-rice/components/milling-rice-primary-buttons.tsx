import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { millingRice } from './milling-rice-provider'

export function MillingRicePrimaryButtons() {
    const { setOpen } = millingRice()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
