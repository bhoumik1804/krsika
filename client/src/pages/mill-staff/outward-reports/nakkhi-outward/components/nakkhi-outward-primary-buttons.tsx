import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { nakkhiOutward } from './nakkhi-outward-provider'

export function NakkhiOutwardPrimaryButtons() {
    const { setOpen, setCurrentRow } = nakkhiOutward()

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
