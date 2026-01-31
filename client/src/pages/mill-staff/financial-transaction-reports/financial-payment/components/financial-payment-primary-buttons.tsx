import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFinancialPayment } from './financial-payment-provider'

export function FinancialPaymentPrimaryButtons() {
    const { setOpen } = useFinancialPayment()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
