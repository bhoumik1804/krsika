import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOtherSales } from './other-sales-provider'

export function OtherSalesPrimaryButtons() {
    const { setOpen, setCurrentRow } = useOtherSales()

    return (
        <Button
            onClick={() => {
                setCurrentRow(null)
                setOpen('add')
            }}
        >
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
