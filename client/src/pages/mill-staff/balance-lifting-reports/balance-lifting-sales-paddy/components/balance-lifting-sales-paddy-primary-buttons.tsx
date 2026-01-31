import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { balanceLiftingSalesPaddy } from './balance-lifting-sales-paddy-provider'

export function BalanceLiftingSalesPaddyPrimaryButtons() {
    const { setOpen } = balanceLiftingSalesPaddy()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
