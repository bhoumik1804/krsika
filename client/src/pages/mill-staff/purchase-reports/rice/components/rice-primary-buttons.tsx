import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRice } from './rice-provider'

export function RicePrimaryButtons() {
    const { setOpen } = useRice()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Rice Purchase
        </Button>
    )
}
