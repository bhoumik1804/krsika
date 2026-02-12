import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePrivatePaddyOutward } from './private-paddy-outward-provider'

export function PrivatePaddyOutwardPrimaryButtons() {
    const { setOpen } = usePrivatePaddyOutward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
