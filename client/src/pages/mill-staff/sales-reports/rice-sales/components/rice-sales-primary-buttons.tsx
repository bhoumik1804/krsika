import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRiceSales } from './rice-sales-provider'

export function RiceSalesPrimaryButtons() {
    const { setOpen } = useRiceSales()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
