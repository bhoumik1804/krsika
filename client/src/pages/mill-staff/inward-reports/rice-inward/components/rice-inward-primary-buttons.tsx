import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { riceInward } from './rice-inward-provider'

export function RiceInwardPrimaryButtons() {
    const { setOpen } = riceInward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
