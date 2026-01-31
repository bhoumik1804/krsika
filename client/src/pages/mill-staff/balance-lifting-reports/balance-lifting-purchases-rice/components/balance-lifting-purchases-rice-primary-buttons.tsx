import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { balanceLiftingPurchasesRice } from './balance-lifting-purchases-rice-provider'

export function BalanceLiftingPurchasesRicePrimaryButtons() {
    const { setOpen } = balanceLiftingPurchasesRice()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Rice Purchase
        </Button>
    )
}
