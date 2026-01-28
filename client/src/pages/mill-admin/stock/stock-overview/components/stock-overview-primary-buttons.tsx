import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { stockOverview } from './stock-overview-provider'

export function StockOverviewPrimaryButtons() {
    const { setOpen } = stockOverview()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
