import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { nakkhiOutward } from './nakkhi-outward-provider'

export function NakkhiOutwardPrimaryButtons() {
    const { setOpen } = nakkhiOutward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
