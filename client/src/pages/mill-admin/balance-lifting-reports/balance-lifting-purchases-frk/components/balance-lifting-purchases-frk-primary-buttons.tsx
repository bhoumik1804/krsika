import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { balanceLiftingPurchasesFrk } from './balance-lifting-purchases-frk-provider'

export function BalanceLiftingPurchasesFrkPrimaryButtons() {
    const { setOpen } = balanceLiftingPurchasesFrk()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Purchase
        </Button>
    )
}
