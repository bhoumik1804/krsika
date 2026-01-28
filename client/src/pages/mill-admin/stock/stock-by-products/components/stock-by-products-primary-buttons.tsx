import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { stockByProducts } from './stock-by-products-provider'

export function StockByProductsPrimaryButtons() {
    const { setOpen } = stockByProducts()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
