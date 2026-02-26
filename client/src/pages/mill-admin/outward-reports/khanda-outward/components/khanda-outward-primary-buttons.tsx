import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { khandaOutward } from './khanda-outward-provider'

export function KhandaOutwardPrimaryButtons() {
    const { setOpen, setCurrentRow } = khandaOutward()

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
