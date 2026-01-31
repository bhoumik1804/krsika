import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { outwardBalanceLiftingRice } from './outward-balance-lifting-rice-provider'

export function OutwardBalanceLiftingRicePrimaryButtons() {
    const { setOpen } = outwardBalanceLiftingRice()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
