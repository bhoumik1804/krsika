import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { otherOutward } from './other-outward-provider'

export function OtherOutwardPrimaryButtons() {
    const { setOpen, setCurrentRow } = otherOutward()

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
