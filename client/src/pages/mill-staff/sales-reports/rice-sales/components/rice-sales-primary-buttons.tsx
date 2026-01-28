import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { riceSales } from './rice-sales-provider'

export function RiceSalesPrimaryButtons() {
    const { setOpen } = riceSales()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
