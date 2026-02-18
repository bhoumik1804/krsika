import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePaddySales } from './paddy-sales-provider'

export function PaddySalesPrimaryButtons() {
    const { setOpen, setCurrentRow } = usePaddySales()

    return (
        <Button
            onClick={() => {
                setCurrentRow(null)
                setOpen('add')
            }}
        >
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
