import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOutwardBalanceLiftingRice } from './outward-balance-lifting-rice-provider'

export function OutwardBalanceLiftingRicePrimaryButtons() {
    const { setOpen } = useOutwardBalanceLiftingRice()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Outward
        </Button>
    )
}
