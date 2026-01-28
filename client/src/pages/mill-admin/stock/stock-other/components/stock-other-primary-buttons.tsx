import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { stockGunnyOther } from './stock-other-provider'

export function StockOtherPrimaryButtons() {
    const { setOpen } = stockGunnyOther()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
