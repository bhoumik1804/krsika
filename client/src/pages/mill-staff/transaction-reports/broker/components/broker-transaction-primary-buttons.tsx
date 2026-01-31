import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBrokerTransaction } from './broker-transaction-provider'

export function BrokerTransactionPrimaryButtons() {
    const { setOpen } = useBrokerTransaction()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Purchase
        </Button>
    )
}
