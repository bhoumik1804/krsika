import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { khandaSales } from './khanda-sales-provider'

export function KhandaSalesPrimaryButtons() {
    const { setOpen } = khandaSales()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
