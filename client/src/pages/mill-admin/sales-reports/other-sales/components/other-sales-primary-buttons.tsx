import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { otherSales } from './other-sales-provider'

export function OtherSalesPrimaryButtons() {
    const { setOpen } = otherSales()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
