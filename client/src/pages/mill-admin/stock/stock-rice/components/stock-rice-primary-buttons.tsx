import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { stockRice } from './stock-rice-provider'

export function StockRicePrimaryButtons() {
    const { setOpen } = stockRice()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
