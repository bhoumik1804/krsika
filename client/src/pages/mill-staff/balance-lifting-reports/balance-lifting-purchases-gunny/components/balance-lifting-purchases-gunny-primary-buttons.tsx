import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBalanceLiftingPurchasesGunny } from './balance-lifting-purchases-gunny-provider'

export function BalanceLiftingPurchasesGunnyPrimaryButtons() {
    const { setOpen } = useBalanceLiftingPurchasesGunny()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Purchase
        </Button>
    )
}
