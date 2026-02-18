import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { silkyKodhaOutward } from './silky-kodha-outward-provider'

export function SilkyKodhaOutwardPrimaryButtons() {
    const { setOpen, setCurrentRow } = silkyKodhaOutward()
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
