import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useKhandaSales } from './khanda-sales-provider'

export function KhandaSalesPrimaryButtons() {
    const { setOpen } = useKhandaSales()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
