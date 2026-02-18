import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { gunnyInward } from './gunny-inward-provider'

export function GunnyInwardPrimaryButtons() {
    const { setOpen, setCurrentRow } = gunnyInward()

    const handleAdd = () => {
        setCurrentRow(null)
        setOpen('add')
    }

    return (
        <Button onClick={handleAdd}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
