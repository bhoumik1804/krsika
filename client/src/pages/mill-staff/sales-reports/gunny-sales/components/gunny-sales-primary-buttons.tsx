import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { gunnySales } from './gunny-sales-provider'

export function GunnySalesPrimaryButtons() {
    const { setOpen } = gunnySales()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
