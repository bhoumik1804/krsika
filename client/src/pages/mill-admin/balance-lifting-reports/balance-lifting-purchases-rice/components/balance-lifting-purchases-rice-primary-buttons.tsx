import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBalanceLiftingPurchasesRice } from './balance-lifting-purchases-rice-provider'

export function BalanceLiftingPurchasesRicePrimaryButtons() {
    const { setOpen } = useBalanceLiftingPurchasesRice()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Rice Purchase
        </Button>
    )
}
