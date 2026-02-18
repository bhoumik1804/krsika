import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useInwards } from './inwards-provider'

export function InwardsPrimaryButtons() {
    const { setOpen } = useInwards()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Entry
        </Button>
    )
}
