import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNakkhiSales } from './nakkhi-sales-provider'

export function NakkhiSalesPrimaryButtons() {
    const { setOpen } = useNakkhiSales()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
