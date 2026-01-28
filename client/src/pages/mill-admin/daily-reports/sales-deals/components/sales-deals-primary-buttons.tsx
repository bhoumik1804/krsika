import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSalesDeals } from './sales-deals-provider'

export function SalesDealsPrimaryButtons() {
    const { setOpen } = useSalesDeals()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Sale Deal
        </Button>
    )
}
