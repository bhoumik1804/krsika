import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePartyTransaction } from './party-transaction-provider'

export function PartyTransactionPrimaryButtons() {
    const { setOpen } = usePartyTransaction()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Transaction
        </Button>
    )
}
