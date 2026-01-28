import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { balanceLiftingPurchasesGunny } from './balance-lifting-purchases-gunny-provider'

export function BalanceLiftingPurchasesGunnyPrimaryButtons() {
    const { setOpen } = balanceLiftingPurchasesGunny()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Purchase
        </Button>
    )
}
