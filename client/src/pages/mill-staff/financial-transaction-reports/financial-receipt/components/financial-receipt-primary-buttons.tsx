import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FinancialReceipt } from './financial-receipt-provider'

export function FinancialReceiptPrimaryButtons() {
    const { setOpen } = FinancialReceipt()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}

