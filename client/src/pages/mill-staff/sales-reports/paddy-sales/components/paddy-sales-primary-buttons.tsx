import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { paddySales } from './paddy-sales-provider'

export function PaddySalesPrimaryButtons() {
    const { setOpen } = paddySales()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
