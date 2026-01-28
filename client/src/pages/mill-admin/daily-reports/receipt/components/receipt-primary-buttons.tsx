import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useReceipt } from './receipt-provider'

export function ReceiptPrimaryButtons() {
    const { setOpen } = useReceipt()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            New Receipt
        </Button>
    )
}
