import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { privatePaddyOutward } from './private-paddy-outward-provider'

export function PrivatePaddyOutwardPrimaryButtons() {
    const { setOpen } = privatePaddyOutward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
