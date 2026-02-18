import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { bhusaOutward } from './bhusa-outward-provider'

export function BhusaOutwardPrimaryButtons() {
    const { setOpen, setCurrentRow } = bhusaOutward()

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
