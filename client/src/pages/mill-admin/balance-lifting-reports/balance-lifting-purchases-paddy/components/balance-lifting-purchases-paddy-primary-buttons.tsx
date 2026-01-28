import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { balanceLiftingPurchasesPaddy } from './balance-lifting-purchases-paddy-provider'

export function BalanceLiftingPurchasesPaddyPrimaryButtons() {
    const { setOpen } = balanceLiftingPurchasesPaddy()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Purchase
        </Button>
    )
}
