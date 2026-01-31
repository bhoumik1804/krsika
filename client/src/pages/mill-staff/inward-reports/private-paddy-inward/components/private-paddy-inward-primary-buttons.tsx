import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { privatePaddyInward } from './private-paddy-inward-provider'

export function PrivatePaddyInwardPrimaryButtons() {
    const { setOpen } = privatePaddyInward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
