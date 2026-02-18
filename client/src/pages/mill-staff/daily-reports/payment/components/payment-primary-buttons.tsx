import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePayment } from './payment-provider'

export function PaymentPrimaryButtons() {
    const { setOpen } = usePayment()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            New Payment
        </Button>
    )
}
