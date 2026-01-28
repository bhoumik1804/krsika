import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { stockPaddy } from './stock-paddy-provider'

export function StockPaddyPrimaryButtons() {
    const { setOpen } = stockPaddy()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
