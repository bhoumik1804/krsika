import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGunnySales } from './gunny-sales-provider'

export function GunnySalesPrimaryButtons() {
    const { setOpen } = useGunnySales()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
