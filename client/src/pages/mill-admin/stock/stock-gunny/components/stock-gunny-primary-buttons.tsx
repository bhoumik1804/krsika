import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { stockGunnyOther } from './stock-gunny-provider'

export function StockGunnyPrimaryButtons() {
    const { setOpen } = stockGunnyOther()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
