import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBalanceLiftingSalesPaddy } from './balance-lifting-sales-paddy-provider'

export function BalanceLiftingSalesPaddyPrimaryButtons() {
    const { setOpen } = useBalanceLiftingSalesPaddy()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Sale
        </Button>
    )
}
