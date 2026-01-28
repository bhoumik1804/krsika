import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePurchaseDeals } from './purchase-deals-provider'

export function PurchaseDealsPrimaryButtons() {
    const { setOpen } = usePurchaseDeals()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Deal
        </Button>
    )
}
